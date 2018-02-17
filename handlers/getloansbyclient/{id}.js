const dataProvider = require('../../data/getloansbyclient/{id}.js');
const Promise = require('bluebird');
const _ = require('lodash');
const Boom = require('boom');

module.exports = {
  get: (req, res) => {
    const status = 200;
    const provider = Promise.promisify(dataProvider.get[200]);
    provider(req, res)
      .then((data) => {
        const {
          amount,
          term,
          reason,
          company,
          stateId,
          requestLoanDate,
          userId,
          lastUpdate,
          interest,
          score,
          approvedDate,
          loanId,
          stateName,
          investorId,
          percentage,
          investPercentage,
        } = data[0];
        let response = {
          amount,
          term,
          reason,
          company,
          stateId,
          requestLoanDate,
          userId,
          lastUpdate,
          interest,
          score,
          approvedDate,
          loanId,
          stateName,
          investorId,
          percentage,
          investPercentage,
          investors: [],
          percentages: [],
        };
        _.forEach(data, (item) => {
          response = {
            ...response,
            investors: [
              ...response.investors,
              item.investorId,
            ],
            percentages: [
              ...response.percentages,
              item.percentage,
            ],
          };
        });
        const result = {
          responses: [_.omit(response, ['investorId', 'percentage'])],
        };
        req.totalCount = data.length ? data.length : 0;
        res(data && result.responses).code(status);
      })
      .catch((err) => {
        res(Boom.badRequest(err));
      });
  },
};
