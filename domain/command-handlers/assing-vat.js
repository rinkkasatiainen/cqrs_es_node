const Parcel = require('../entities/parcel');

const assignVat = async (eventStream, id, vat_amount, cb) => {
  const parcel = Parcel.load(await eventStream.findByUUID(id));
  parcel.assignVat(vat_amount);
  parcel.serviceCostAdded(10);

  // SENDING EMAIL
  parcel.recipientNotifiedAboutPaymentWaiting({channel: 'EMAIL'});

  // SENDING SMS
  //parcel.recipientNotified({about: 'Waiting for payment', channel: 'SMS'});

  cb();
};

module.exports = assignVat;