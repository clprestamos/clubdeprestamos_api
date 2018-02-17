const Mockgen = require('../mockgen.js');
const pg = require('../../postgresql.js');
const squel = require('squel');
const squelPg = squel.useFlavour('postgres');
const logger = require('../../logger.js');

module.exports = {
  get: {
    200: (req, res, callback) => {
      const query = squelPg.select()
        .field('u.id', 'user_id')
        .field('u.name')
        .field('u.last_name')
        .field('u.email')
        .field('u.role_id')
        .field('u.facebook')
        .field('u.twitter')
        .field('u.signup_date')
        .field('u.is_active')
        .field('u.avatar')
        .field('u.identification')
        .field('l.*')
        .field('l.id', 'loand_id')
        .field('c.*')
        .field('c.id', 'client_id')
        .left_join('loans_tb', 'l', 'l.user_id = u.id')
        .left_join('clients_tb', 'c', 'c.user_id = u.id')
        .from('users_tb', 'u')
        .where('u.id = ?', req.params.id)
        .toParam();
      logger.info('QUERY', query);
      pg(query, callback);
    },
    default: (req, res, callback) => {
      Mockgen().responses({
        path: '/getuserallinformation/{id}',
        operation: 'post',
        response: 'default',
      }, callback);
    },
  },
};
