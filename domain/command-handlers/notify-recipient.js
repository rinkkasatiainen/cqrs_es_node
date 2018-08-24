
const Parcel = require('../entities/parcel')

const notifyRecipient = async (eventStream, id, cb) => {
  const parcel = Parcel.load(await eventStream.findByUUID(id));
  parcel.notifyRecipient();

  // SENDING EMAIL
  parcel.recipientNotifiedAboutNewShipment({channel: 'EMAIL'});

  // SENDING SMS
  //parcel.recipientNotified({about: 'Incoming package', channel: 'SMS'});

  //cb();
};

module.exports = notifyRecipient;