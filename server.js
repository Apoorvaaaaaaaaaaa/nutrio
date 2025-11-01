const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const session = require('express-session');
const User = require('./models/User'); // Import User model

const app = express();
const port = 3000;

// Middleware for parsing request bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Set up EJS as the view engine
app.set('view engine', 'ejs');

// Serve static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, '/')));

// MongoDB connection
mongoose
  .connect('mongodb://localhost:27017/nutrio_db', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log('Error connecting to MongoDB:', err));

// Set up session middleware
app.use(
  session({
    secret: 'your-secret-key', // Choose a secret key for signing the session
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Set to 'true' in production with HTTPS
  })
);

// Handle signup requests
app.post('/signup', async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    return res.status(400).send('Passwords do not match');
  }

  try {
    // Check if the exact user (name and email) already exists
    const existingUserWithNameAndEmail = await User.findOne({ name, email });

    if (existingUserWithNameAndEmail) {
      return res.status(400).send('User already exists. Try logging in.');
    }

    // Check if the email alone is already registered
    const existingUserWithEmail = await User.findOne({ email });

    if (existingUserWithEmail) {
      return res.status(400).send('Email already registered. Try logging in.');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    req.session.user = { name: newUser.name, email: newUser.email };
    res.redirect('/profile');
  } catch (err) {
    console.log('Error during signup:', err);
    res.status(500).send('An error occurred during signup. Please try again.');
  }
});

// Handle login requests
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user exists in the database
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).send('Invalid email or password');
    }

    // Compare the input password with the hashed password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).send('Invalid email or password');
    }

    // Set session data for the authenticated user
    req.session.user = { name: user.name, email: user.email };

    res.status(200).send('Login successful');
  } catch (err) {
    res.status(500).send('An error occurred during login. Please try again.');
  }
});


// Profile route (GET)
app.get('/profile', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }

  const { name, email } = req.session.user;
  res.render('profile', { name, email, successMessage: '', errorMessage: '' });
});

// Profile route (POST)
app.post('/profile', async (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }

  const { age, gender, dob, weight, height } = req.body;

  if (!age || !gender || !dob || !weight || !height) {
    return res.render('profile', {
      name: req.session.user.name,
      email: req.session.user.email,
      errorMessage: 'All fields are mandatory to proceed.',
      successMessage: '',
    });
  }

  try {
    await User.updateOne(
      { email: req.session.user.email },
      { $set: { age, gender, dob, weight, height } }
    );

    res.render('profile', {
      name: req.session.user.name,
      email: req.session.user.email,
      successMessage: 'Profile saved successfully!',
      errorMessage: '',
    });
  } catch (err) {
    console.log(err);
    res.status(500).send('An error occurred while saving your profile.');
  }
});

// Serve login page
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'login.html'));
});

// Serve signup page
app.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, 'signup.html'));
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
