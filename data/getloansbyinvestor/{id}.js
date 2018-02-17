const _ = require('lodash');
const Mockgen = require('../mockgen.js');
const pg = require('../../postgresql.js');
const squel = require('squel');

const squelPg = squel.useFlavour('postgres');

module.exports = {
  patch: {
    202: (req, res, callback) => {
      const payload = _.mapKeys(req.payload, (v, k) => _.snakeCase(k));
      const query = squelPg.update()
        .table('loan_investor_tb')
        .setFields(payload)
        .where('id = ?', req.params.id)
        .returning('*')
        .toParam();
      pg(query, callback);
    },
    default: (req, res, callback) => {
      Mockgen().responses({
        path: '/geloansbyinvestor/{id}',
        operation: 'patch',
        response: 'default',
      }, callback);
    },
  },
  get: {
		200: (req, res, callback) => {
			const query = squelPg.select()
											.field('li.*')
											.from('loan_investor_tb', 'li')
											.where('li.loan_id = ?', req.params.id)
											.toParam();
			pg(query, callback);
		},
    default: (req, res, callback) => {
      Mockgen().responses({
        path: '/getloansbyinvestor/{id}',
        operation: 'get',
        response: 'default',
      }, callback);
    },
  },
};
