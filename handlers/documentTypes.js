const dataProvider = require('../data/documentTypes.js');
const Promise = require('bluebird');

module.exports = {
  get: (req, res, next) => {
    const status = 200;
    const provider = Promise.promisify(dataProvider.get[200]);
    provider(req, res)
      .then((data) => {
        const response = {
          results: data,
        };
        req.totalCount = data.length ? response.results.length : 0;
        res(data && response).code(status);
      })
      .catch((err) => {
        next(err);
      });
  },
};
