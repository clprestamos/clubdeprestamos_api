const Mockgen = require('./mockgen.js');
const pg = require('../postgresql.js');
const _ = require('lodash');
const moment = require('moment');
const squel = require('squel');

const squelPg = squel.useFlavour('postgres');

module.exports = {
	get: {
		200: (req, res, callback) => {
			let query = squelPg.select()
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
										.field(squelPg.select()
											.field('COUNT(li.id)')
											.from('loan_investor_tb', 'li')
											.where('li.investor_id = u.id'), 'invests')
										.from('users_tb', 'u')
										.where('role_id = ?', 2)
										.toParam();
			pg(query, callback);
		},
		default: (req, res, callback) => {
			Mockgen().responses({
				path: '/investors',
				operation: 'get',
				response: 'default',
			}, callback);
		},
	},
	post: {
		201: (req, res, callback) => {
			const payload = _.mapKeys(req.payload, (v, k) => _.snakeCase(k));
			const keys = _.map(Object.keys(payload), v => `"${v}"`).join(',');
			const values = _.map(payload, (v) => {
				if (_.isNumber(v)) {
					return v;
				}
				if (_.isArray(v)) {
					return `'{${v.join(',')}}'`;
				}
				return `'${v}'`;
			}).join(',');
			const today = moment().format();
			const query = `INSERT INTO investors_tb ("last_update",${keys}) VALUES ('${today}',${values}) RETURNING id`;
			pg(query, callback);
		},
		default: (req, res, callback) => {
			Mockgen().responses({
				path: '/investors',
				operation: 'post',
				response: 'default',
			}, callback);
		},
	},
};
