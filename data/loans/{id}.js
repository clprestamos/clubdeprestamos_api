const Mockgen = require('../mockgen.js');
const pg = require('../../postgresql.js');
const _ = require('lodash');
const moment = require('moment');
const squel = require('squel');

const squelPg = squel.useFlavour('postgres');

module.exports = {
	patch: {
		202: (req, res, callback) => {
			const payload = _.mapKeys(req.payload, (v, k) => _.snakeCase(k));
			const query = squelPg.update()
											.table('loans_tb')
											.set('last_update', moment().format())
											.setFields(payload)
											.where('id = ?', req.params.id)
											.returning('id AS loan_id')
											.toParam();
			pg(query, callback);
		},
		default: (req, res, callback) => {
			Mockgen().responses({
				path: '/loans/{id}',
				operation: 'patch',
				response: 'default',
			}, callback);
		},
	},
	get: {
		200: (req, res, callback) => {
			const query = squelPg.select()
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
											.field(squelPg.select()
												.field('SUM(li.percentage)')
												.from('loan_investor_tb', 'li')
												.where('li.loan_id = l.id'), 'invest_percentage')
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
											.where('l.id = ?', req.params.id)
											.toParam();
			pg(query, callback);
		},
		default: (req, res, callback) => {
			Mockgen().responses({
				path: '/loans/{id}',
				operation: 'get',
				response: 'default',
			}, callback);
		},
	},
};
