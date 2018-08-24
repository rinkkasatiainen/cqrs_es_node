const jwt = require('jsonwebtoken');
const roles = require('../roles');

class InvalidTokenError { }

module.exports = (passport_user) => {
  if (passport_user) {
    return {
      isInRole: (role) => {
        return (role === roles.OWNER)
      },

      id: () => {
        token_data.owner_id
      }
    }
  } 

  return {
    isInRole: (role) => {
      return (role === roles.OWNER)
    },
    id: () => {
        null
    }
  }

};