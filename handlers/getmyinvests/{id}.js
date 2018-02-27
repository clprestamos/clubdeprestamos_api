const dataProvider = require('../../data/getmyinvests/{id}.js');
const Promise = require('bluebird');
const Boom = require('boom');
const _ = require('lodash');

module.exports = {
  get: (req, res) => {
    const status = 200;
    const provider = Promise.promisify(dataProvider.get['200']);
    provider(req, res)
      .then((data) => {
        const result = _.uniqBy(data, 'loanId');
        req.totalCount = result.length ? result.length : 0;
        res(result).code(status);
      })
      .catch((err) => {
        res(Boom.badRequest(err));
      });
  },
};
