const mongoose = require('mongoose');
const StreamId = mongoose.model('StreamId');
const Event = mongoose.model('Event');
const Owner = mongoose.model('Owner');
const Parcel = require('../entities/parcel');

function getAddress(req) {
  console.log('address', req.body.address )
  const {
    street, town, postCode, country,
  } = req.body.address;
  const address = {
    street, town, postalCode: postCode, country,
  };
  return address;
}

function clientData(req) {
  const { email, name, phone } = req.body.customer;
  return {
    name, email, phone, address: getAddress(req),
  };
}

const createParcel = async (eventStream, req, res, cb) => {
  const owner = await new Owner(clientData(req)).save();
  const { user } = req;
  const streamId = await new StreamId({
    owner,
    authority: user,
  }).save();

  const history = await eventStream.findByUUID(streamId)

  const parcel = Parcel.load(history);
  console.log(JSON.stringify(req.body))
  parcel.received(streamId, {
    ownerId: owner._id,
    parcel: req.body.parcel,
  });

  cb(streamId._id);
};

module.exports = createParcel;
