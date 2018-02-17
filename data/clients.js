const Mockgen = require('./mockgen.js');
const pg = require('../postgresql.js');
const _ = require('lodash');
const squel = require('squel');

const squelPg = squel.useFlavour('postgres');

module.exports = {
  get: {
    200: (req, res, callback) => {
      let query = squelPg.select()
                        .field('u.id', 'user_id')
                        .field('u.avatar')
                        .field('u.name')
                        .field('u.last_name')
                        .field('u.identification')
                        .field('u.nationality')
                        .field('u.phone')
                        .field('u.reference_phone')
                        .field('u.email')
                        .field('u.address')
                        .field('u.province')
                        .field('u.canton')
                        .field('u.district')
                        .field('u.zip_code')
                        .field('u.relative_phone')
                        .field('u.cellphone')
                        .field('u.facebook')
                        .field('u.twitter')
                        .field('u.signup_date')
                        .field('u.is_active')
                        .field('u.role_id')
                        .field('u.last_update')
                        .field('r.name', 'role_name')
                        .join('roles_tb', 'r',
                          squelPg.expr()
                            .and('r.role_id = u.role_id')
                        )
                        .from('users_tb', 'u')
                        .where('u.role_id = ?', 1)
                        .toParam();
      pg(query, callback);
    },
    default: (req, res, callback) => {
      Mockgen().responses({
        path: '/clients',
        operation: 'get',
        response: 'default',
      }, callback);
    },
  },
  post: {
    201: (req, res, callback) => {
      const payload = _.mapKeys(req.payload, (v, k) => _.snakeCase(k));
      const keys = _.map(Object.keys(payload), v => `"${v}"`).join(',');
      const values = _.map(payload, (v) => {
        if (_.isNumber(v)) {
          return v;
        }
        if (_.isArray(v)) {
          return `'{${v.join(',')}}'`;
        }
        return `'${v}'`;
      }).join(',');
      const query = `INSERT INTO clients_tb (${keys}) VALUES (${values}) RETURNING *`;
      pg(query, callback);
    },
    default: (req, res, callback) => {
      Mockgen().responses({
        path: '/clients',
        operation: 'post',
        response: 'default',
      }, callback);
    },
  },
};
