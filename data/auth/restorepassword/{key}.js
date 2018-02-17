const Mockgen = require('../../mockgen.js');
const pg = require('../../../postgresql.js');

module.exports = {
  get: {
    200: (req, res, callback) => {
      const columns = 'users.id AS user_id, users.password_key, users.password_date';
      const query = `SELECT ${columns} FROM users_tb AS users WHERE users.is_active = 'true' AND users.password_key ='${req.params.key}'`;
      pg(query, callback);
    },
    default: (req, res, callback) => {
      Mockgen().responses({
        path: '/auth/restorepassword/{key}',
        operation: 'get',
        response: 'default',
      }, callback);
    },
  },
};
