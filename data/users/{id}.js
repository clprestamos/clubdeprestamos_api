const Mockgen = require('../mockgen.js');
const pg = require('../../postgresql.js');
const _ = require('lodash');
const moment = require('moment');
const squel = require('squel');
const passwordHash = require('md5');

squel.registerValueHandler(Array, item => JSON.stringify(item));

const squelPg = squel.useFlavour('postgres');

const returning = 'avatar, name, last_name, identification, nationality, phone, reference_phone, email, address, province, canton, district, zip_code, relative_phone, cellphone, facebook, twitter, signup_date, last_signin_date, is_active, role_id, last_update, bank, client_account, iban, payment_id, sex, marital_status, job_sector, job_category, job_time, other_properties, home, has_vehicle, academic_level'; // eslint-disable-line

module.exports = {
  patch: {
    202: (req, res, callback) => {
      const payload = _.mapKeys(req.payload, (v, k) => _.snakeCase(k));
      payload.last_update = moment().format();
      if (payload.password) {
        payload.password = passwordHash(payload.password);
      }
      let query = '';
      if (req.params.id === -1) {
        query = squelPg.update()
          .table('users_tb')
          .setFields(payload)
          .where('email = ?', req.params.email)
          .returning(returning)
          .toParam();
      } else {
        query = squelPg.update()
          .table('users_tb')
          .setFields(payload)
          .where('id = ?', req.params.id)
          .returning(returning)
          .toParam();
      }
      pg(query, callback);
    },
    default: (req, res, callback) => {
      Mockgen().responses({
        path: '/users/{id}',
        operation: 'patch',
        response: 'default',
      }, callback);
    },
  },
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
        .field('u.last_signin_date')
        .field('u.is_active')
        .field('u.role_id')
        .field('u.payment_id')
        .field('u.last_update')
        .field('u.bank')
        .field('u.client_account')
        .field('u.iban')
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
        .where('u.id = ?', req.params.id)
        .toParam();
      pg(query, callback);
    },
    default: (req, res, callback) => {
      Mockgen().responses({
        path: '/users/{id}',
        operation: 'get',
        response: 'default',
      }, callback);
    },
  },
};
