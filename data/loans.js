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
										.field(
											squelPg.select()
												.field('s.name')
												.from('states_tb', 's')
												.where('s.id = l.state_id'),
											'state_name'
										)
										.field(squelPg.select()
											.field('SUM(li.percentage)')
											.from('loan_investor_tb', 'li')
											.where('li.loan_id = l.id'), 'invest_percentage')
										.field('c.user_id', 'user_id')
										.from('loans_tb', 'l')
										.left_join('clients_tb', 'c',
											squelPg.expr()
												.and('c.loan_id = l.id')
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
