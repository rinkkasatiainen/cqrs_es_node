const Parcel = require('../entities/parcel');

const findParcel = eventStream => async (streamId) => {
  const history = await eventStream.findByUUID(streamId);

  const entity = Parcel.load(history);
  return entity;
};

module.exports = findParcel;
