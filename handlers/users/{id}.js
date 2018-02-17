const dataProvider = require('../../data/users/{id}.js');
const Promise = require('bluebird');
const Boom = require('boom');
const _ = require('lodash');

module.exports = {
  patch: (req, res) => {
    const status = 202;
    const provider = Promise.promisify(dataProvider.patch['202']);
    provider(req, res)
      .then((data) => {
        const response = _.chain(data)
          .map(item => _.pickBy(item, _.identity))
          .value();
        const result = {
          responses: response,
        };
        req.totalCount = data.length ? data.length : 0;
        res(data && result.responses).code(status);
      })
      .catch((err) => {
        res(Boom.conflict(err));
      });
  },
  get: (req, res) => {
    const status = 200;
    const provider = Promise.promisify(dataProvider.get['200']);
    provider(req, res)
      .then((data) => {
        const response = _.chain(data)
          .map(item => _.pickBy(item, _.identity))
          .value();
        const result = {
          responses: response,
        };
        req.totalCount = data.length ? data.length : 0;
        res(data && result.responses).code(status);
      })
      .catch((err) => {
        res(Boom.conflict(err));
      });
  },
};
