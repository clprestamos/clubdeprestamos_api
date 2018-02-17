const Mockgen = require('./mockgen.js');
const pg = require('../postgresql.js');
const squel = require('squel');

const squelPg = squel.useFlavour('postgres');

module.exports = {
	get: {
		200: (req, res, callback) => {
			const query = squelPg.select()
											.from('zipcodelist_tb')
											.field('province')
											.distinct()
											.toString();
			pg(query, callback);
		},
		default: (req, res, callback) => {
			Mockgen().responses({
				path: '/getProvinces',
				operation: 'get',
				response: 'default',
			}, callback);
		},
	},
};
