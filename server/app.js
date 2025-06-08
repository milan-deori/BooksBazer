const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const User = require('./models/user');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const jwt = require('jsonwebtoken');

dotenv.config();

const app = express();

// ---------- MIDDLEWARE ----------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: 'https://booksfindr.somestudys.in', credentials: true }));

app.use(session({
  secret: "milansecret",
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, secure: false, maxAge: 86400000 }
}));

app.use(passport.initialize());
app.use(passport.session());

// ---------- PASSPORT LOCAL STRATEGY ----------
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// ---------- GOOGLE STRATEGY ----------
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "/auth/google/callback"
},
  async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await User.findOne({ email: profile.emails[0].value });

      if (!user) {
  user = await User.create({
    name: profile.displayName,
    email: profile.emails[0].value,
    profilePic: profile.photos[0].value,
    googleId: profile.id, // <-- add this
  });
}

      return done(null, user);
    } catch (err) {
      return done(err, null);
    }
  }
));

// ---------- MONGODB ----------
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB error:', err));

// ---------- ROUTES ----------
app.get('/', (req, res) => res.send("API Running"));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/books', require('./routes/books'));
app.use('/api/wishlist', require('./routes/wishlist'));

// ---------- GOOGLE AUTH ROUTES ----------
app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    const token = jwt.sign({
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      profilePic: req.user.profilePic
    }, process.env.JWT_SECRET, { expiresIn: '24h' });

    // Redirect to frontend with token
    res.redirect(`http://localhost:5173/auth-success?token=${token}`);
  }
);

// ---------- START SERVER ----------
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));


