const Mockgen = require('../mockgen.js');
const pg = require('../../postgresql.js');
const _ = require('lodash');
const moment = require('moment');
const squel = require('squel');

const squelPg = squel.useFlavour('postgres');

module.exports = {
  patch: {
    202: (req, res, callback) => {
      let payload = {
        last_update: moment().format(),
      };
      payload = _.assign({}, payload, _.mapKeys(req.payload, (v, k) => _.snakeCase(k)));
      const query = squelPg.update()
        .table('clients_tb')
        .setFields(payload)
        .where('id = ?', req.params.id)
        .returning('id AS client_id, *')
        .toParam();
      pg(query, callback);
    },
    default: (req, res, callback) => {
      Mockgen().responses({
        path: '/clients/{id}',
        operation: 'patch',
        response: 'default',
      }, callback);
    },
  },
  get: {
    200: (req, res, callback) => {
      const clients = 'clients.id AS client_id, clients.user_id, clients.loan_ids, clients.nationality, clients.cellphone, clients.address, clients.province, clients.canton, clients.district, clients.zip_code, clients.reference_phone, clients.relative_phone, clients.last_update';
      const users = 'users.id AS user_id, users.name, users.last_name, users.email, users.signup_date, users.is_active, users.identification';
      const query = `SELECT ${clients}, ${users} FROM users_tb AS users INNER JOIN clients_tb AS clients ON (users.id = clients.user_id) WHERE users.is_active = 'true' AND clients.id = ${req.params.id}`;
      pg(query, callback);
    },
    default: (req, res, callback) => {
      Mockgen().responses({
        path: '/clients/{id}',
        operation: 'get',
        response: 'default',
      }, callback);
    },
  },
};
