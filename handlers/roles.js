const dataProvider = require('../data/roles.js');
const Promise = require('bluebird');
const Boom = require('boom');

module.exports = {
  get: (req, res) => {
    const status = 200;
    const provider = Promise.promisify(dataProvider.get[200]);
    provider(req, res)
      .then((data) => {
        const response = {
          results: data,
        };
        req.totalCount = data.length ? response.results.length : 0;
        res(data && response.results).code(status);
      })
      .catch((err) => {
        res(Boom.badRequest(err.detail));
      });
  },
  post: (req, res) => {
    const status = 201;
    const provider = Promise.promisify(dataProvider.post['201']);
    provider(req, res)
      .then((data) => {
        const response = {
          results: data[0],
        };
        req.totalCount = data.length ? response.results.length : 0;
        res(data && response.results).code(status);
      })
      .catch((err) => {
        res(Boom.badRequest(err.detail));
      });
  },
};
