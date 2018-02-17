const Mockgen = require('../mockgen.js');
const pg = require('../../postgresql.js');
const squel = require('squel');

const squelPg = squel.useFlavour('postgres');

module.exports = {
  get: {
    200: (req, res, callback) => {
      const query = squelPg.select()
        .field('l.*')
        .field('l.id', 'loan_id')
        .field('s.name', 'state_name')
        .field('li.investor_id')
        .field('li.percentage')
        .field(squelPg.select()
          .field('SUM(li.percentage)')
          .from('loan_investor_tb', 'li')
          .where('li.loan_id = l.id'), 'invest_percentage')
        .from('loans_tb', 'l')
        .join('states_tb', 's',
          squelPg.expr()
            .and('l.state_id = s.id')
        )
        .left_join('loan_investor_tb', 'li',
          squelPg.expr()
            .and('li.loan_id = l.id')
        )
        .where('l.user_id = ?', req.params.id)
        .toParam();
      pg(query, callback);
    },
    default: (req, res, callback) => {
      Mockgen().responses({
        path: '/getloansbyclient/{id}',
        operation: 'get',
        response: 'default',
      }, callback);
    },
  },
};
