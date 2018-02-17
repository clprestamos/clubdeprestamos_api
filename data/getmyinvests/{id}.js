const Mockgen = require('../mockgen.js');
const pg = require('../../postgresql.js');
const squel = require('squel');

const squelPg = squel.useFlavour('postgres');

module.exports = {
	get: {
		200: (req, res, callback) => {
			const query = squelPg.select()
											.field('l.id', 'loan_id')
											.field('l.amount')
											.field('l.term')
											.field('l.reason')
											.field('l.company')
											.field('l.state_id')
											.field('l.request_loan_date')
											.field('l.user_id')
											.field('l.last_update')
											.field('l.interest')
											.field('l.score')
											.field('l.approved_date')
											.field('u.avatar')
											.field('u.name')
											.field('u.last_name')
											.field('u.identification')
											.field('u.bank')
											.field('u.client_account')
											.field('u.iban')
											.field('li.investor_id')
											.field('li.percentage', 'investor_percentage')
											.field('s.name', 'state_name')
											.field(squelPg.select()
												.field('SUM(li.percentage)')
												.from('loan_investor_tb', 'li')
												.where(`li.investor_id = ${req.params.id}`), 'percentage')
											.from('loan_investor_tb', 'li')
											.left_join('loans_tb', 'l',
												squelPg.expr()
													.and('l.id = li.loan_id')
											)
											.right_join('users_tb', 'u',
												squelPg.expr()
													.and('l.user_id = u.id')
											)
											.join('states_tb', 's',
												squelPg.expr()
													.and('l.state_id = s.id')
											)
											.where('li.investor_id = ?', req.params.id)
											.toParam();
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
