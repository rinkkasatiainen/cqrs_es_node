const { moment } = require('../../../helpers');

module.exports = data => (event) => {
  const { about, channel } = JSON.parse(event.payload);
  const { type } = event;
  const new_data = {
    ...data,
  };

  new_data.events.push({
    type,
    name: 'Proof of import was sent to 556074-7569 (IKEA)',
    when: moment(event.created).fromNow(),
  });

  return new_data;
};
