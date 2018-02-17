const Mockgen = require('./mockgen.js');
const pg = require('../postgresql.js');

module.exports = {
  get: {
    200: (req, res, callback) => {
      const query = 'SELECT states.id AS state_id, states.name AS state_name FROM states_tb AS states';
      pg(query, callback);
    },
    default: (req, res, callback) => {
      Mockgen().responses({
        path: '/states',
        operation: 'get',
        response: 'default',
      }, callback);
    },
  },
};
