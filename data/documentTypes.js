const Mockgen = require('./mockgen.js');
const pg = require('../postgresql.js');

module.exports = {
  get: {
    200: (req, res, callback) => {
      const query = 'SELECT * from document_types_tb';
      pg(query, callback);
    },
    default: (req, res, callback) => {
      Mockgen().responses({
        path: '/documents',
        operation: 'get',
        response: 'default',
      }, callback);
    },
  },
};
