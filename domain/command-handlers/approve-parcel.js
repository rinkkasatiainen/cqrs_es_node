const Parcel = require('../entities/parcel');

const approveParcel = async (eventStream, id, cb) => {
  const parcel = Parcel.load(await eventStream.findByUUID(id));
  parcel.approve();
  
  // SENDING EMAIL
  parcel.recipientNotifiedAboutReleasedShipment({channel: 'EMAIL'});
  parcel.senderNotified({about: 'Proof of import delivered', channel: 'API'});
  parcel.taxAuthorityNotified({about: 'Proof of import delivered', channel: 'API'});
  
  cb();
};

module.exports = approveParcel;