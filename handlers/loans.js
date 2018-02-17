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
        let response = [];
        if (data.length) {
          _.forEach(data, (item) => {
            const sameItems = _.filter(data, { loanId: item.loanId });
            if (sameItems.length >= 2) {
              const investors = _.map(sameItems, (i) => {
                return i.investorId && i.investorId;
              });
              const percentages = _.map(sameItems, i => i.percentage);
              response = [...response, _.assign({}, item, { investors, percentages })];
            }
            response.push(item);
          });
        }
        response = _.chain(response).uniqBy('loanId').value();
        const result = {
          responses: response,
        };
        req.totalCount = response.length ? response.length : 0;
        res(response && result.responses).code(status);
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
