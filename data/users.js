const Mockgen = require('./mockgen.js');
const pg = require('../postgresql.js');
const _ = require('lodash');
const moment = require('moment');
const passwordHash = require('md5');
const squel = require('squel');
const logger = require('../logger');

const squelPg = squel.useFlavour('postgres');

module.exports = {
  get: {
    200: (req, res, callback) => {
      const query = squelPg.select()
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
                      .field('u.payment_id')
                      .field('u.sex')
                      .field('u.marital_status')
                      .field('u.home')
                      .field('u.job_category')
                      .field('u.job_sector')
                      .field('u.job_time')
                      .field('u.other_properties')
                      .field('u.has_vehicle')
                      .field('u.academic_level')
                      .field('r.name', 'role_name')
                      .join('roles_tb', 'r',
                        squelPg.expr()
                          .and('r.role_id = u.role_id')
                      )
                      .from('users_tb', 'u')
                      .toString();
      pg(query, callback);
    },
    default: (req, res, callback) => {
      Mockgen().responses({
        path: '/users',
        operation: 'get',
        response: 'default',
      }, callback);
    },
  },
  post: {
    201: (req, res, callback) => {
      try {
        const today = moment().format();
        const noHashPassword = req.payload.password;
        const hashPassword = passwordHash(noHashPassword);
        const payload = _.mapKeys(req.payload, (v, k) => _.snakeCase(k));
        const columns = _.map(Object.keys(payload), k => `"${k}"`);
        let values = _.map(req.payload, v => v);
        values = _.map(values, (v, k) => {
          if (_.isNumber(values[k])) {
            return `${values[k]}`;
          }
          if (_.isArray(v)) {
            return `'{${v.join(',')}}'`;
          }
          if (v === noHashPassword) {
            return `'${hashPassword}'`;
          }
          return `'${values[k]}'`;
        });
        const query = `INSERT INTO users_tb ("last_update",${columns}) VALUES ('${today}',${values.join(',')}) RETURNING id`;
        pg(query, callback);
      } catch (error) {
        logger.error(`${new Date()} - ERROR CREATE NEW USER: ${error}`);
      }
    },
    default: (req, res, callback) => {
      Mockgen().responses({
        path: '/users',
        operation: 'post',
        response: 'default',
      }, callback);
    },
  },
};
