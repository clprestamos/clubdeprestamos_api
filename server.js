/* eslint-disable no-console */
const hapi = require('hapi');
const hapiPagination = require('hapi-pagination');
const hapiSwaggeredUi = require('hapi-swaggered-ui');
const inert = require('inert');
const swaggerize = require('swaggerize-hapi');
const authJwt = require('hapi-auth-jwt2');
const path = require('path');
const vision = require('vision');
const logger = require('./logger.js');
const env = require('env2')('./.env');

const files = require('./handlers/files');
const email = require('./handlers/email');

const server = new hapi.Server({
	connections: {
		router: {
			stripTrailingSlash: true,
		},
		routes: {
			cors: {
				origin: [
					'https://www.clubdeprestamos.cr',
					'https://www.clubdeprestamos.cr/upload',
					'https://admin.clubdeprestamos.cr',
					'http://admin.clubdeprestamos.cr',
          'http://localhost:8080',
					'http://localhost:8080/upload',
				],
			},
		},
	},
});

server.connection({
  port: process.env.PORT || 3000,
  labels: ['api'],
});

const validate = (decoded, request, cb) => {
  logger.log('============ validate ================');
  logger.info(decoded);
  logger.info(request.info);
  logger.log('=======================================');

  return cb(null, true);
};

server.register(authJwt, (err) => {
  if (err) {
    logger.error('authJwt err');
  }
  server.auth.strategy('jwt', 'jwt',
    {
      key: process.env.JWTSECRET || 'NeverShareYourSecret',
      validateFunc: validate,
      verifyOptions: {
        algorithms: [process.env.JWTALGORITHM],
      },
    });

  server.register({
    register: swaggerize,
    options: {
      api: path.resolve('./config/swagger.json'),
      handlers: path.resolve('./handlers'),
      docspath: '/swagger',
      cors: true,
    },
  }, () => {
    server.register({
      register: hapiPagination,
      options: {
        query: {
          limit: {
            name: 'limit',
            default: 20,
          },
        },
        routes: {
          include: [
            '/users',
            '/roles',
            '/documents',
            '/investors',
            '/loans',
            '/clients',
          ],
          exclude: ['/', '/docs'],
        },
        meta: {
          baseUri: (process.env.HOST) ? `http://${process.env.HOST}` : '/',
          page: {
            active: true,
          },
          limit: {
            active: true,
          },
        },
      },
    },
    (error) => {
      if (error) {
        throw error;
      }
    });

    server.start(() => {
      const host = process.env.HOST || server.info.host;
      server.plugins.swagger.setHost(host); // we asume port 80
      logger.info('App running on %s:%d', host, process.env.PORT, 'NODE_ENV', process.env.NODE_ENV || 'DEV');
    });
  });
});

if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'DEV') {
  server.register([
    inert,
    vision,
    {
      register: hapiSwaggeredUi,
      options: {
        title: 'Club de Préstamos API Explorer',
        path: '/docs',
        swaggerEndpoint: '/swagger',
      },
    }],
    {
      select: 'api',
    },
    (err) => {
      if (err) {
        throw err;
      }
    } // eslint-disable-line comma-dangle
  );

  server.route({
    path: '/',
    method: 'GET',
    handler: (request, res) => {
      res.redirect('/docs');
    },
  });
} else if (process.env.NODE_ENV === 'production') {
  server.route({
    path: '/',
    method: 'GET',
    handler: (request, res) => {
      res.redirect('/');
    },
  });
}

server.route({
  path: '/upload',
  method: 'POST',
  config: {
    payload: {
      output: 'stream',
      parse: true,
      allow: 'multipart/form-data',
      maxBytes: 2097152,
    },
  },
  handler: files.upload,
});

server.route({
  path: '/upload',
  method: 'PATCH',
  config: {
    payload: {
      output: 'stream',
      parse: true,
      allow: 'multipart/form-data',
      maxBytes: 2097152,
    },
  },
  handler: files.update,
});

server.route({
  path: '/contact',
  method: 'POST',
  handler: email.contact,
});

server.route({
  path: '/sendmailto',
  method: 'POST',
  handler: email.sendmailto,
});
