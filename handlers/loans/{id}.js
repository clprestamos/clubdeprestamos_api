const dataProvider = require('../../data/loans/{id}.js');
const Promise = require('bluebird');
const Boom = require('boom');
const _ = require('lodash');

module.exports = {
  patch: (req, res) => {
    const status = 202;
    const provider = Promise.promisify(dataProvider.patch['202']);
    provider(req, res)
      .then((data) => {
        const result = {
          responses: data[0],
        };
        req.totalCount = data.length ? data.length : 0;
        res(data && result.responses).code(status);
      })
      .catch((err) => {
        res(Boom.badRequest(err));
      });
  },
  get: (req, res) => {
    const status = 200;
    const provider = Promise.promisify(dataProvider.get['200']);
    provider(req, res)
      .then((data) => {
        let response = [];
        if (data.length) {
          const loans = _.uniqBy(data, 'investorId');
          const investors = _.map(loans, loan => loan.investorId);
          const percentages = _.map(loans, loan => loan.percentage);
          response = _.chain(loans).map((loan) => {
            const {
              loanId,
              amount,
              term,
              reason,
              company,
              stateId,
              requestLoanDate,
              lastUpdate,
              interest,
              score,
              approvedDate,
              userId,
              stateName,
              name,
              lastName,
              avatar,
            } = loan;
            return {
              loanId,
              amount,
              term,
              reason,
              company,
              stateId,
              requestLoanDate,
              lastUpdate,
              interest,
              score,
              approvedDate,
              userId,
              stateName,
              investors,
              percentages,
              name,
              lastName,
              avatar,
            };
          }).uniqBy('loanId');
        }
        req.totalCount = response.length ? response.length : 0;
        res(response).code(status);
      })
      .catch((err) => {
        res(Boom.badRequest(err));
      });
  },
};
