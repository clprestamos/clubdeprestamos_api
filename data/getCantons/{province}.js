const Mockgen = require('../mockgen.js');
const pg = require('../../postgresql.js');
const squel = require('squel');

const squelPg = squel.useFlavour('postgres');

module.exports = {
	get: {
		200: (req, res, callback) => {
			const query = squelPg.select()
											.from('zipcodelist_tb')
											.field('canton')
											.distinct()
											.where('province = ?', req.params.province)
											.toParam();
			pg(query, callback);
		},
		default: (req, res, callback) => {
			Mockgen().responses({
				path: '/getCantons',
				operation: 'get',
				response: 'default',
			}, callback);
		},
	},
};
