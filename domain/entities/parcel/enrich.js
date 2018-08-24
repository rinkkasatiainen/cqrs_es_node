const { moment } = require('../../../helpers');

module.exports = data => (event) => {
  const { type } = event;
  const new_data = {
    ...data,
    original_invoice: 'invoice.pdf',
  };

  new_data.events.push({
    type,
    name: 'Shipment details added by recipient',
    when: moment(event.created).fromNow(),
  });

  return new_data;
};
