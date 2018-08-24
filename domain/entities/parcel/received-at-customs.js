const { moment } = require('../../../helpers');

module.exports = data => (event) => {
  const { ownerId, parcel } = JSON.parse(event.payload);
  const { type, streamId } = event

  const new_data = {
    ...data,
    ownerId,
    streamId,
    originator: parcel.from,
    price: parcel.price,
  };

  new_data.events.push({
    type,
    name: 'Incoming shipment',
    when: moment(event.created).fromNow(),
  });

  return new_data;
};
