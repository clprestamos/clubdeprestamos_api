const Mockgen = require('../../mockgen.js');
const pg = require('../../../postgresql.js');
const squel = require('squel');

const squelPg = squel.useFlavour('postgres');

module.exports = {
	get: {
		200: (req, res, callback) => {
			const {
				province,
				canton,
			} = req.params;
			const query = squelPg.select()
											.from('zipcodelist_tb')
											.field('district')
											.where('province = ? AND canton = ?', province, canton)
											.toParam();
			pg(query, callback);
		},
		default: (req, res, callback) => {
			Mockgen().responses({
				path: '/getDistricts',
				operation: 'get',
				response: 'default',
			}, callback);
		},
	},
};
