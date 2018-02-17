const dataProvider = require('../../../data/documents/user/{id}.js');
const Promise = require('bluebird');

module.exports = {
  get: (req, res, next) => {
    const status = 200;
    const provider = Promise.promisify(dataProvider.get['200']);
    provider(req, res)
      .then((data) => {
        const response = {
          results: data,
        };
        req.totalCount = data.length ? response.results.length : 0;
        res(data && response.results).code(status);
      })
      .catch((err) => {
        next(err);
      });
  },
};
