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
										.field('l.id', 'loan_id')
										.field('l.*')
										.field('u.name')
										.field('u.last_name')
										.field('u.bank')
										.field('u.client_account')
										.field('u.identification')
										.field('u.iban')
										.field('s.name', 'state_name')
										.field('li.investor_id')
										.field('li.percentage')
										.from('loans_tb', 'l')
										.join('states_tb', 's',
											squelPg.expr()
												.and('l.state_id = s.id')
										)
										.join('users_tb', 'u',
											squelPg.expr()
												.and('u.id = l.user_id')
										)
										.left_join('loan_investor_tb', 'li',
											squelPg.expr()
												.and('li.loan_id = l.id')
										)
										.toString();
			pg(query, callback);
		},
		default: (req, res, callback) => {
			Mockgen().responses({
				path: '/loan',
				operation: 'get',
				response: 'default',
			}, callback);
		},
	},
	post: {
		201: (req, res, callback) => {
			try {
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
				const query = `INSERT INTO loans_tb ("last_update",${keys}) VALUES ('${today}',${values}) RETURNING id`;
				pg(query, callback);
			} catch (error) {
				console.log('ERROR', error);
			}
		},
		default: (req, res, callback) => {
			Mockgen().responses({
				path: '/loans',
				operation: 'post',
				response: 'default',
			}, callback);
		},
	},
};
