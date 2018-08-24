const mongoose = require('mongoose');
const Event = mongoose.model('Event');

const store = async (type, streamId, payload) => {
  const what_is_going_in = {
    streamId,
    version: 0,
    payload: JSON.stringify(payload),
    type,
  };

  console.log(`Storing: ${JSON.stringify(what_is_going_in)}`);
  const event = new Event(what_is_going_in);
  await event.save();
  return event;
};

const events = {
  ENRICH: 'EnrichWithOriginalInvoice',
  PARCELRECEIVEDATCUSTOMS: 'ParcelReceivedAtCustoms',
  PAID: 'PAID',
  NOTIFYRECIPIENT: 'NOTIFYRECIPIENT',
  VATVERIFIED: 'VATVERIFIED',
  SERVICECOSTADDED: 'SERVICECOSTADDED',
  RECIPIENTNOTIFIEDRELEASED: 'RECIPIENTNOTIFIEDRELEASED',
  RECIPIENTNOTIFIEDNEWSHIPMENT: 'RECIPIENTNOTIFIEDNEWSHIPMENT',
  ASSIGNVAT: 'VATASSIGNED',
  APPROVEDBYCUSTOMS: 'APPROVEDBYCUSTOMS',
  SENDERNOTIFIED: 'SENDERNOTIFIED',
  TAXAUTHORITYNOTIFIED: 'TAXAUTHORITYNOTIFIED',
  RECIPIENTNOTIFIEDPAYMENTWAITING: 'RECIPIENTNOTIFIEDPAYMENTWAITING'
};

const eventToFun = {
  [events.ENRICH]: require('./parcel/enrich'),
  [events.PARCELRECEIVEDATCUSTOMS]: require('./parcel/received-at-customs'),
  [events.PAID]: require('./parcel/paid'),
  [events.NOTIFYRECIPIENT]: require('./parcel/notify-recipient'),
  [events.RECIPIENTNOTIFIEDRELEASED]: require('./parcel/recipient-notified-released'),
  [events.RECIPIENTNOTIFIEDNEWSHIPMENT]: require('./parcel/recipient-notified-new-shipment'),
  [events.RECIPIENTNOTIFIEDPAYMENTWAITING]: require('./parcel/recipient-notified-payment-waiting'),
  [events.ASSIGNVAT]: require('./parcel/assign-vat'),
  [events.SERVICECOSTADDED]: require('./parcel/servicecost-added'),
  [events.APPROVEDBYCUSTOMS]: require('./parcel/approved-by-customs'),
  [events.SENDERNOTIFIED]: require('./parcel/sender-notified'),
  [events.TAXAUTHORITYNOTIFIED]: require('./parcel/tax-authority-notified')
};

const applyChangeFunc = (data, event) => {
  console.log(`Applying change for:${JSON.stringify(event)}`);
  let new_data = { ...data };

  const changerMethod = eventToFun[event.type];
  if (changerMethod) {
    new_data = changerMethod(new_data)(event);
    new_data.version += 1;
  }
  return new_data;
};

class Parcel {
  constructor(_) {
    this.data = {
      events: [],
      version: 0,
    };
  }

  applyChange(event) {
    console.log(this);
    this.data = applyChangeFunc(this.data, event);
  }

  async received(streamId, data) {
    const event = await store(events.PARCELRECEIVEDATCUSTOMS, streamId, data);
    this.applyChange(event);
  }

  async enrich() {
    console.log('enrich', this.data, this.data.streamId);
    const event = await store(events.ENRICH, this.data.streamId, {});
    this.applyChange(event);
  }

  async pay() {
    const event = await store(events.PAID, this.data.streamId, {});
    this.applyChange(event);
  }

  async notifyRecipient() {
    const event = await store(events.NOTIFYRECIPIENT, this.data.streamId, {});
    this.applyChange(event);
  }

   async recipientNotifiedAboutNewShipment(data) {
    const event = await store(events.RECIPIENTNOTIFIEDNEWSHIPMENT, this.data.streamId, data);
    this.applyChange(event);
  }

  async recipientNotifiedAboutReleasedShipment(data) {
    const event = await store(events.RECIPIENTNOTIFIEDRELEASED, this.data.streamId, data);
    this.applyChange(event);
  }

  async recipientNotifiedAboutPaymentWaiting(data) {
    const event = await store(events.RECIPIENTNOTIFIEDPAYMENTWAITING, this.data.streamId, data);
    this.applyChange(event);
  }

  async senderNotified(data) {
    const event = await store(events.SENDERNOTIFIED, this.data.streamId, data);
    this.applyChange(event);
  }

  async assignVat(vat_amount) {
    const event = await store(events.ASSIGNVAT, this.data.streamId, {vat_amount});
    this.applyChange(event);
  }
  
  async serviceCostAdded(service_cost) {
    const event = await store(events.SERVICECOSTADDED, this.data.streamId, {service_cost});
    this.applyChange(event);
  }

  async approve() {
    const event = await store(events.APPROVEDBYCUSTOMS, this.data.streamId, {});
    this.applyChange(event);
  }
  async taxAuthorityNotified() {
    const event = await store(events.TAXAUTHORITYNOTIFIED, this.data.streamId, {});
    this.applyChange(event);
  }
}

const load = (history) => {
  const parcel = new Parcel();

  history.forEach((event) => {
    parcel.applyChange(event);
  });

  return parcel;
};

const create = () => Parcel();

exports.load = load;
exports.create = create;
