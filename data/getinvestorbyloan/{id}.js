const Mockgen = require('../mockgen.js');
const pg = require('../../postgresql.js');
const squel = require('squel');

const squelPg = squel.useFlavour('postgres');

module.exports = {
	get: {
		200: (req, res, callback) => {
			const query = squelPg.select()
				.field('u.id', 'user_id')
				.field('u.name')
				.field('u.last_name')
				.field('u.avatar')
				.field('u.identification')
				.field('l.*')
				.field('li.percentage', 'percentage')
				.from('users_tb', 'u')
				.left_join('loan_investor_tb', 'li',
					squelPg.expr().and(`li.loan_id = ${req.params.id}`)
				)
				.right_join('loans_tb', 'l',
					squelPg.expr().and(`l.id = ${req.params.id}`)
				)
				.where('u.id = li.investor_id')
				.toParam();
			pg(query, callback);
		},
		default: (req, res, callback) => {
			Mockgen().responses({
				path: '/getinvestorbyloan/{id}',
				operation: 'get',
				response: 'default',
			}, callback);
		},
	},
};
