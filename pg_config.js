module.exports = {
	development: {
		client: 'pg',
		connection: {
			user: process.env.PGUSER,
			database: process.env.PGDATABASE,
			password: process.env.PGPASSWORD,
			host: process.env.PGHOST,
			port: process.env.PGPORT,
			max: 10,
			idleTimeoutMillis: 30000,
		},
	},
};
