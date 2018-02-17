const pg = require('../postgresql.js');
const squel = require('squel');
const squelPg = squel.useFlavour('postgres');

module.exports = {
	post: {
		201: (driveId, req, res, callback) => {
			const { payload } = req;
			const dowloadLink = `https://docs.google.com/uc?id=${driveId}`;
			const query = squelPg.update()
											.into('users_tb')
											.set('avatar', dowloadLink)
											.where('id = ?', payload.userId)
											.returning('avatar')
											.toParam();
			pg(query, callback);
		},
	},
	patch: {
		202: (driveId, req, res, callback) => {
			const { payload } = req;
			const dowloadLink = `https://docs.google.com/uc?id=${driveId}`;
			const query = squelPg.update()
											.into('users_tb')
											.set('avatar', dowloadLink)
											.where('id = ?', payload.userId)
											.returning('avatar')
											.toParam();
			pg(query, callback);
		},
		default: (req, res, callback) => {
		},
	},
};
