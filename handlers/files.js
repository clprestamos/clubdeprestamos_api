const Promise = require('bluebird');

const dataProvider = require('../data/files.js');
const drive = require('../drive');

module.exports = {
	upload: (req, res, next) => {
		const status = 201;
		const payload = req.payload;
		const provider = Promise.promisify(dataProvider.post['201']);

		drive.upload(payload).then(response => {
			provider(response.id, req, res)
				.then(data => {
					const response = {
						results: data[0],
					};
					req.totalCount = data.length ? response.results.length : 0;
					res(data && response.results).code(status);
				})
				.catch(err => {
					next(err);
				});
		});
	},
	update: (req, res, next) => {
		const status = 202;
		const payload = req.payload;
		const provider = Promise.promisify(dataProvider.patch['202']);

		drive.update(payload).then((response) => {
			provider(response.id, req, res)
				.then(data => {
					const response = {
						results: data[0],
					};
					req.totalCount = data.length ? response.results.length : 0;
					res(data && response.results).code(status);
				})
				.catch(err => {
					next(err);
				});
		});
	},
};
