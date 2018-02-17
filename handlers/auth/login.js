const dataProvider = require('../../data/auth/login');
const generateToken = require('../users_token');
const Promise = require('bluebird');
const Boom = require('boom');

module.exports = {
  post: [
    (req, res) => {
      const status = 200;
      const provider = Promise.promisify(dataProvider.post['200']);
      provider(req, res)
        .then((data) => {
          if (data.length) {
            const response = {
              responses: {
                results: {
                  userInfo: data[0],
                  token: generateToken(data[0]),
                },
              },
            };
            req.totalCount = data.length ? response.responses.results.length : 0;
            res(data && response.responses).code(status);
          } else {
            res(Boom.unauthorized('Invalid password or email!'));
          }
        })
        .catch((err) => {
          res(Boom.badRequest(err.detail));
        });
    },
  ],
};
