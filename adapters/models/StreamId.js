const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
const uuid = require('node-uuid');

const streamSchema = new Schema({
  _id: {
    type: String,
    default: uuid.v1,
  },
  owner: {
    type: String,
    ref: 'Owner',
    //required: 'you must supply a Owner for a stream',
  },
  authority:{
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    //required: true,
  },
});


function autopopulate(next) {
  this.populate('owner');
  next();
}

streamSchema.pre('find', autopopulate);
streamSchema.pre('findOne', autopopulate);

module.exports = mongoose.model('StreamId', streamSchema);
