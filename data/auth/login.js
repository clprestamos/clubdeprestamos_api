const Mockgen = require('../mockgen.js');
const passwordHash = require('md5');
const pg = require('../../postgresql.js');
const squel = require('squel');
const logger = require('../../logger.js');

const squelPg = squel.useFlavour('postgres');
/**
 * Operations on /auth/login
 */
module.exports = {
  post: {
    200: (req, res, callback) => {
      try {
        const hashedPassword = passwordHash(req.payload.password);
        const query = squelPg.select()
                        .field('u.id', 'user_id')
                        .field('u.name')
                        .field('u.last_name')
                        .field('u.email')
                        .field('u.is_active')
                        .field('u.role_id')
                        .field('u.payment_id')
                        .field('r.name', 'role_name')
                        .from('users_tb AS u')
                        .left_join('roles_tb', 'r',
                          squelPg.expr()
                            .and('u.role_id = r.role_id')
                        )
                        .where('u.email = ? AND u.password = ? AND u.is_active = ?', req.payload.email, hashedPassword, true)
                        .toParam();
        logger.info(`${new Date()} LOGIN: ${req.payload.email}`);
        pg(query, callback);
      } catch (error) {
        logger.error(new Date(), 'Endpoint /auth/login', error);
      }
    },
    default: (req, res, callback) => {
      /**
       * Using mock data generator module.
       * Replace this by actual data for the api.
       */
      Mockgen().responses({
        path: '/auth/login',
        operation: 'post',
        response: 'default',
      }, callback);
    },
  },
};
