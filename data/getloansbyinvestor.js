const Mockgen = require('./mockgen.js');
const pg = require('../postgresql.js');
const squel = require('squel');

const squelPg = squel.useFlavour('postgres');

module.exports = {
	get: {
		200: (req, res, callback) => {
			let query = squelPg.select()
										.field('*')
										.from('loan_investor_tb')
										.toString();
			pg(query, callback);
		},
		default: (req, res, callback) => {
			Mockgen().responses({
				path: '/getloansbyinvestor',
				operation: 'get',
				response: 'default',
			}, callback);
		},
	},
};
