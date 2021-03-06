const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
const md5 = require('md5');
const validator = require('validator');
const mongodbErrorHandler = require('mongoose-mongodb-errors');
const passportLocalMongoose = require('passport-local-mongoose');

const addressSchema = new Schema({
  street: {
    type: String,
  },
  postalCode: {
    type: String,
  },
  town: {
    type: String,
  },
  country: {
    type: String,
  },
})

const ownerSchema = new Schema({
  email: {
    type: String,
    lowercase: true,
    trim: true,
    validate: [validator.isEmail, 'Invalid Email Address'],
    required: 'Please Supply an email address',
  },
  name: {
    type: String,
    required: 'Please supply a name',
    trim: true,
  },
  phone: {
    type: String,
    trim: true,
  },
  address: addressSchema,
});

ownerSchema.virtual('gravatar').get(function () {
  const hash = md5(this.email);
  return `https://gravatar.com/avatar/${hash}?s=200`;
});

ownerSchema.plugin(passportLocalMongoose, { usernameField: 'email' });
ownerSchema.plugin(mongodbErrorHandler);

module.exports = mongoose.model('Owner', ownerSchema);
