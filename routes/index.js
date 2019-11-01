var express = require('express');
var router = express.Router();

// Load middleware
const { notLoggedIn } = require('../middlewares/auth');

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render(
    'index',
    { title: 'Express' });
});

// GET Success page
router.get('/success', notLoggedIn, async (req, res, next) => {
  const user = req.session.currentUser;
  res.render('success', {
    user
  });
});

module.exports = router;
