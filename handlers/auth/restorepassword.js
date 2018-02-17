const dataProvider = require('../../data/auth/restorepassword');
const logger = require('../../logger.js');
const Promise = require('bluebird');
const Boom = require('boom');

module.exports = {
  patch: [
    (req, res) => {
      const status = 202;
      const provider = Promise.promisify(dataProvider.patch['202']);
      provider(req, res)
        .then((data) => {
          if (data.length) {
            const response = {
              responses: {
                results: {
                  sent: true,
                  data,
                },
              },
            };
            req.totalCount = data.length ? response.responses.results.length : 0;
            res(data && response.responses).code(status);
          } else {
            res(Boom.unauthorized('Error with the restore password!'));
          }
        })
        .catch((err) => {
          res(Boom.badRequest(err.detail));
          logger.error(err);
        });
    },
  ],
};
