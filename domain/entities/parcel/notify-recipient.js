const { moment } = require('../../../helpers');

module.exports = data => (event) => {
  const { type } = event;
  const new_data = {
    ...data
  };
  return new_data;
};
