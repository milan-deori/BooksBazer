const express = require('express');
require("dotenv").config();
const mongoose = require("mongoose");
const passport = require("passport");
const cors = require("cors");
const session = require("express-session");
const User = require("./models/user"); // assumes passport-local-mongoose is used
const app = express();
const port = 3000;



// Connect to MongoDB
async function main() {
  await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
}
main().then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));


// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS for frontend communication
app.use(cors({
  origin: "http://localhost:5173", // your frontend
  credentials: true
}));

// Session config (store in memory; use MongoStore in production)
app.use(session({
  secret: "yourSecretKey",
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false, // true if using HTTPS
    maxAge: 1000 * 60 * 60 * 24 // 1 day
  }
}));

// Passport initialization
app.use(passport.initialize());
app.use(passport.session());

// Use static serialize/deserialize from passport-local-mongoose
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// Routes
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Signup
app.post("/signup", async (req, res) => {
  const { email, name, number, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const newUser = new User({ email, name, number });
    await User.register(newUser, password);

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


// Login
app.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(401).json({ message: "Invalid email or password" });

    req.login(user, (err) => {
      if (err) return next(err);

      // Send basic user info to frontend
      return res.status(200).json({
        message: "Login successful",
        user: {
          id: user._id,
          name: user.name,
          email: user.email
        }
      });
    });
  })(req, res, next);
});


// Logout
app.post("/logout", (req, res) => {
  req.logout(err => {
    if (err) return res.status(500).json({ message: "Logout failed" });
    res.json({ message: "Logged out successfully" });
  });
});


// Start server
app.listen(port, () => {
  console.log(`app listening at http://localhost:${port}`);
});
