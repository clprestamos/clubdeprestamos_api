const Mockgen = require('./mockgen.js');
const pg = require('../postgresql.js');
const _ = require('lodash');
const squel = require('squel');

const squelPg = squel.useFlavour('postgres');

module.exports = {
  post: {
    201: (req, res, callback) => {
			const payload = _.mapKeys(req.payload, (v, k) => _.snakeCase(k));
      const query = squelPg.insert()
											.into('loan_investor_tb')
											.setFields(payload)
                      .returning('*')
											.toString();
      pg(query, callback);
    },
    default: (req, res, callback) => {
      Mockgen().responses({
        path: '/assigninvestorloan',
        operation: 'post',
        response: 'default',
      }, callback);
    },
  },
};
