

const { moment } = require('../../../helpers');

module.exports = data => (event) => {
  const { type } = event;
  const { vat_amount } = JSON.parse(event.payload);
  const new_data = {
    ...data,
    vat_amount,
  };

  new_data.events.push({
    type,
    name: `A VAT of ${vat_amount}€ assinged`,
    when: moment(event.created).fromNow(),
  });
  return new_data;
};
