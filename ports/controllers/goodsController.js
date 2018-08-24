const mongoose = require('mongoose');
const promisify = require('es6-promisify');
const passport = require('passport');

const StreamId = mongoose.model('StreamId');
const Event = mongoose.model('Event');
const Owner = mongoose.model('Owner');

exports.loginForm = (req, res) => {
  res.render('customs/login', {});
};
exports.registerForm = (req, res) => {
  res.render('customs/register', {});
};
exports.home = (req, res) => {
  res.render('customs/index', {});
};

// Registering
exports.validateGoods = (req, res, next) => {
  req.sanitizeBody('customer[name]');
  req.checkBody('customer[name]', 'You must supply a name!').notEmpty();
  req.checkBody('customer[email]', 'That Email is not valid!').isEmail();
  req.sanitizeBody('email').normalizeEmail({
    gmail_remove_dots: false,
    remove_extension: false,
    gmail_remove_subaddress: false,
  });

  const errors = req.validationErrors();
  if (errors) {
    req.flash('error', errors.map(err => err.msg));
    res.render('customs/newGoods', { body: req.body, flashes: req.flash() });
    return; // stop the fn from running
  }
  next(req, res); // there were no errors!
};