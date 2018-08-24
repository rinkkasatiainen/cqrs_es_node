const { moment } = require('../../../helpers');

module.exports = data => (event) => {
  const { about, channel } = JSON.parse(event.payload);
  const { type } = event;
  const new_data = {
    ...data,
  };

  new_data.events.push({
    type,
    name: `Recipient was notified about shipment being released`,
    when: moment(event.created).fromNow(),
  });

  return new_data;
};
