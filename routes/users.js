const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

// Load models
const User = require('../models/User');

// Load middleware
const { notLoggedIn } = require('../middlewares/auth');

/* GET users listing. */
router.get('/', (req, res, next) => {
  res.send('respond with a resource');
});

// POST User registration
router.post('/register', [
  check('name').isLength({ min: 3 }),
  check('email').isEmail(),
  check('mobile').isMobilePhone()
], async (req, res, next) => {
  // Validate input fields
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    let errorName = '';
    let errorEmail = '';
    let errorMobile = '';
    errors.array().forEach((error) => {
      if (error.param === 'name') { errorName = 'You must enter a valid name'; }
      if (error.param === 'email') { errorEmail = 'You must enter a valid email address'; }
      if (error.param === 'mobile') { errorMobile = 'That is not a valid phone number'; }
    });
    return res.render('index', { errorName, errorEmail, errorMobile });
  }
  // Get form details
  const { name, email, mobile } = req.body;

  // Assemble new user
  const newUserData = {
    name,
    email,
    mobile
  };
  console.log(newUserData);
  try {
    // Check if user is already registered
    const user = await User.findOne({
      $or: [
        { email: email },
        { mobile: mobile }
      ]
    });
    if (user !== null) {
      res.render('index', { error: 'You are already registered fot this event, check your email for more information'});
    }
    // Save new user to database
    const newUser = await User.create(newUserData);

    req.session.currentUser = newUser;
    res.redirect('/success');
  } catch (error) {
    next(error);
  }
});

// GET Success page
router.get('/success', notLoggedIn, async (req, res, next) => {
  const user = req.session.currentUser;
  res.render('success', { user });
});

module.exports = router;
