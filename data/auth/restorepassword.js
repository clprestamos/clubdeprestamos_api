const Mockgen = require('../mockgen.js');
const passwordHash = require('md5');
const pg = require('../../postgresql.js');
const moment = require('moment');
/**
 * Operations on /auth/login
 */
module.exports = {
	patch: {
		202: (req, res, callback) => {
			const today = moment().format();
			let query = '';
			if (req.payload.userId) {
	      const noHashPassword = req.payload.password;
	      const hashPassword = passwordHash(noHashPassword);
				query = `UPDATE users_tb AS users SET "last_update"='${today}', "password_key"='', "password_date"=null, "password"='${hashPassword}'  WHERE "id" = '${req.payload.userId}' RETURNING users.email`;
			} else {
				const password_date = moment().format('YYYY-MM-DD HH:mm:ss');
				var text = "";
				var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

				for( var i=0; i < 9; i++ )
					text += possible.charAt(Math.floor(Math.random() * possible.length));
				query = `UPDATE users_tb AS users SET "last_update"='${today}', "password_key"='${text}', "password_date"='${password_date}'  WHERE "email" = '${req.payload.email}' RETURNING users.email, users.password_key`;
			}
			pg(query, callback);
		},
		default: (req, res, callback) => {
			Mockgen().responses({
				path: '/auth/restorepassword',
				operation: 'patch',
				response: 'default',
			}, callback);
		},
	},
};
