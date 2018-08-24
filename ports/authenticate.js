
// TODO: Renamte to authorize
const authenticate = role => async (req, res, next) => {
  if (req._identity.isInRole(role)) {
    
    next();
      return;
  }
  res.render('unauthorized');
};


module.exports = authenticate;
