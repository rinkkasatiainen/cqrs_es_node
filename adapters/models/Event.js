const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
const md5 = require('md5');
const validator = require('validator');
const mongodbErrorHandler = require('mongoose-mongodb-errors');
const passportLocalMongoose = require('passport-local-mongoose');

const eventSchema = new Schema({
  streamId: {
    type: String,
    ref: 'StreamId',
    required: 'you must supply a stream id',
  },
  version: {
    type: Number,
    required: 'Please provide number',
  },
  payload: {
    type: String,
    required: 'Payload required',
  },
  type: {
    type: String,
    required: 'Type required',
  },
  created: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Event', eventSchema);
