const jwt = require('jsonwebtoken');
const roles = require('../roles');
const promisify = require('es6-promisify')
class InvalidTokenError { }

// module.exports = (token) => {
//   jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
//     if(err) {
//       throw new InvalidTokenError()
//     }
//     return {
//       isInRole: (role) => {
//         return (role === roles.OWNER)
//       },

//       id: () => {
//         //console.log(token_data)
//         decoded.owner_id
//       }
//     }
//   });
// };

module.exports = async (token) => {
  const verify = promisify(jwt.verify, jwt)
  token_data = await verify(token, process.env.TOKEN_SECRET)
  let identity = {
    isInRole: (role) => {
      return (role === roles.OWNER)
    }
  }

  identity.id = token_data.owner_id

  return identity
};