const dataProvider = require('../data/assigninvestorloan.js');
const Promise = require('bluebird');
const Boom = require('boom');

module.exports = {
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
        res(Boom.badRequest(err));
      });
  },
};
