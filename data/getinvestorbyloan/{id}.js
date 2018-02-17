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
										.field('li.*')
										.field('u.avatar')
										.field('u.name')
										.field('u.last_name')
										.field('u.identification')
										.from('loans_tb', 'l')
										.join('loan_investor_tb', 'li', `l.id = ${req.params.id}`)
										.left_join('users_tb', 'u', 'li.investor_id = u.id')
										.toString();
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
