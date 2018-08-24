const { moment } = require('../../../helpers');

module.exports = data => (event) => {
  const { type } = event;
  const { service_cost } = JSON.parse(event.payload);
  const new_data = {
    ...data,
    service_cost
  };

  // new_data.events.push({
  //   type,
  //   name: 'Service cost ' + service_cost + '€ assinged',
  //   when: moment(event.created).fromNow(),
  // });

  return new_data;
};
