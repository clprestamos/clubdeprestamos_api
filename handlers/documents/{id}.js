const dataProvider = require('../../data/documents/{id}.js');
const Promise = require('bluebird');

module.exports = {
  patch: (req, res, next) => {
    const status = 202;
    const provider = Promise.promisify(dataProvider.patch['202']);
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
  get: (req, res, next) => {
    const status = 200;
    const provider = Promise.promisify(dataProvider.get['200']);
    provider(req, res)
      .then((data) => {
        const response = {
          results: data[0],
        };
        req.totalCount = data.length ? response.results.length : 0;
        res(data && response.results).code(status);
      })
      .catch((err) => {
        next(err);
      });
  },
};
