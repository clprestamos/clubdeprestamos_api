const Mockgen = require('../mockgen.js');
const pg = require('../../postgresql.js');
const _ = require('lodash');
const moment = require('moment');
const squel = require('squel');

const squelPg = squel.useFlavour('postgres');

module.exports = {
	patch: {
		202: (req, res, callback) => {
			let payload = {
				last_update: moment().format(),
			};
			payload = _.assign({}, payload, _.mapKeys(req.payload, (v, k) => _.snakeCase(k)));
			const query = squelPg.update()
				.table('investors_tb')
				.setFields(payload)
				.where('id = ?', req.params.id)
				.returning('id AS investor_id, *')
				.toParam();
			pg(query, callback);
		},
		default: (req, res, callback) => {
			Mockgen().responses({
				path: '/investors/{id}',
				operation: 'patch',
				response: 'default',
			}, callback);
		},
	},
	get: {
		200: (req, res, callback) => {
			const query = squelPg.select()
											.field('u.id', 'user_id')
											.field('u.name')
											.field('u.last_name')
											.field('u.identification')
											.field('u.nationality')
											.field('u.phone')
											.field('u.reference_phone')
											.field('u.email')
											.field('u.address')
											.field('u.province')
											.field('u.canton')
											.field('u.district')
											.field('u.zip_code')
											.field('u.relative_phone')
											.field('u.cellphone')
											.field('u.facebook')
											.field('u.twitter')
											.field('u.signup_date')
											.field('u.is_active')
											.field('u.role_id')
											.field('u.last_update')
											.field('u.bank')
											.field('u.client_account')
											.field('u.iban')
											.from('users_tb', 'u')
											.where('u.id = ?', req.params.id)
											.toParam();
			pg(query, callback);
		},
		default: (req, res, callback) => {
			Mockgen().responses({
				path: '/investors/{id}',
				operation: 'get',
				response: 'default',
			}, callback);
		},
	},
};
