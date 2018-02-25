const Mockgen = require('../mockgen.js');
const pg = require('../../postgresql.js');
const squel = require('squel');

const squelPg = squel.useFlavour('postgres');

module.exports = {
	get: {
		200: (req, res, callback) => {
			const query = squelPg.select()
				.field('l.id', 'loan_id')
				.field('l.*')
				.field(
					squelPg.select()
						.field('s.name')
						.from('states_tb', 's')
						.where('s.id = l.state_id'), 'state_name'
				)
				.field(squelPg.select()
					.field('SUM(li.percentage)')
					.from('loan_investor_tb', 'li')
					.where('li.loan_id = l.id'), 'invest_percentage')
				.from('loans_tb', 'l')
				.join('loan_investor_tb', 'li',
					squelPg.expr().and(`li.investor_id = ${req.params.id}`)
				)
				.where('l.id = li.loan_id')
				.toString();
			pg(query, callback);
		},
		default: (req, res, callback) => {
			Mockgen().responses({
				path: '/getmyinvests/{id}',
				operation: 'get',
				response: 'default',
			}, callback);
		},
	},
};
