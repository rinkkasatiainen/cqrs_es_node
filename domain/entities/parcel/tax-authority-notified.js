const { moment } = require('../../../helpers');

module.exports = data => (event) => {
  const { type } = event;
  const new_data = {
    ...data,
  };

  new_data.events.push({
    type,
    name: 'Tax authority notified',
    when: moment(event.created).fromNow(),
  });

  return new_data;
};
