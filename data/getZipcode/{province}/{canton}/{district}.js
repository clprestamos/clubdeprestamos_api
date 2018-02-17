const Mockgen = require('../../../mockgen.js');
const pg = require('../../../../postgresql.js');
const squel = require('squel');

const squelPg = squel.useFlavour('postgres');

module.exports = {
	get: {
		200: (req, res, callback) => {
			const {
				province,
				canton,
				district,
			} = req.params;
			const query = squelPg.select()
				.from('zipcodelist_tb')
				.field('zip_code')
				.where('province = ? AND canton = ? AND district = ?', province, canton, district)
				.toParam();
			pg(query, callback);
		},
		default: (req, res, callback) => {
			Mockgen().responses({
				path: '/getZipcode',
				operation: 'get',
				response: 'default',
			}, callback);
		},
	},
};
