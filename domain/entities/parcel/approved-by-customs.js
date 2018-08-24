const { moment } = require('../../../helpers');

module.exports = data => (event) => {
  const { type } = event;
  const new_data = {
    ...data
  };
  new_data.events.push({
    type,
    name: 'Shipment was approved and released by customs',
    when: moment(event.created).fromNow(),
  });
  return new_data;
};
