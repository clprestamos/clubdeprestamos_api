const Mockgen = require('../mockgen.js');
const pg = require('../../postgresql.js');
const squel = require('squel');

const squelPg = squel.useFlavour('postgres');

module.exports = {
  get: {
    200: (req, res, callback) => {
      const query = squelPg.select()
      .field('SUM(loan_investor_tb.percentage) AS percentage')
      .from('loan_investor_tb')
      .where('loan_investor_tb.loan_id = ? OR loan_investor_tb.investor_id = ?', req.params.id)
      .toParam();

      pg(query, callback);
    },
    default: (req, res, callback) => {
      Mockgen().responses({
        path: '/checkloanpercentage/{id}',
        operation: 'get',
        response: 'default',
      }, callback);
    },
  },
};
