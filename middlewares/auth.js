// Check if user is logged out
const notLoggedIn = (req, res, next) => {
  if (!req.session.currentUser) {
    return res.redirect('/');
  }
  next();
};

module.exports = { notLoggedIn };
