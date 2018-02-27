const dataProvider = require('../data/loans.js');
const Promise = require('bluebird');
const Boom = require('boom');
const _ = require('lodash');

module.exports = {
  get: (req, res) => {
    const status = 200;
    const provider = Promise.promisify(dataProvider.get[200]);
    provider(req, res)
      .then((data) => {
        const response = _.uniqBy(data, 'loanId');
        req.totalCount = response.length ? response.length : 0;
        res(response).code(status);
      })
      .catch((err) => {
        res(Boom.badRequest(err));
      });
  },
  post: (req, res) => {
    const status = 201;
    const provider = Promise.promisify(dataProvider.post['201']);
    provider(req, res)
      .then((data) => {
        const result = {
          responses: data[0],
        };
        req.totalCount = data.length ? data.length : 0;
        res(data && result.responses).code(status);
      })
      .catch((err) => {
        res(Boom.badRequest(err.detail));
      });
  },
};
