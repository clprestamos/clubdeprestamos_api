const dataProvider = require('../../data/getuserallinformation/{id}.js');
const Promise = require('bluebird');

module.exports = {
  get: (req, res, next) => {
    const status = 200;
    const provider = Promise.promisify(dataProvider.get[200]);
    provider(req, res)
      .then((data) => {
        const result = {
          responses: data,
        };
        req.totalCount = data.length ? data.length : 0;
        res(data && result.responses).code(status);
      })
      .catch((err) => {
        next(err);
      });
  },
};
