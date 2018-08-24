const { moment } = require('../../../helpers');

module.exports = data => (event) => {
  const { type } = event;
  const new_data = {
    ...data,
    paid: true,
  };

  new_data.events.push({
    type,
    name: 'Duties and customs paid by recipient',
    when: moment(event.created).fromNow(),
  });

  return new_data;
};
