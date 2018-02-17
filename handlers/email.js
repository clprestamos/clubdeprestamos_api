const email = require('../email');

module.exports = {
  contact: (req, res, next) => {
    const payload = req.payload;
    email.contact(payload).then((info) => {
      res({ message: 'OK', response: info.response }).code(250);
    }).catch((err) => {
      next(err);
    });
  },
  sendmailto: (req, res, next) => {
    const payload = req.payload;
    email.sendmailto(payload).then((info) => {
      res({ message: 'OK', response: info.response }).code(250);
    }).catch((err) => {
      next(err);
    });
  },
};
