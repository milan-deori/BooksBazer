const express = require('express');
require("dotenv").config();
const mongoose = require("mongoose");
const passport = require("passport");
const jwt = require('jsonwebtoken');
const cors = require("cors");
const session = require("express-session");
const authMiddleware = require("./middleware/authMiddleware");
const User = require("./models/user"); // Passport-local-mongoose assumed
const Book = require('./models/sell'); 
const upload = require("./utils/upload"); // Assuming you have a file upload utility  
const { isAuthor } = require("./middleware/isAuthor"); // Assuming you have an isAuthor middleware


const app = express();
const port = 3000;

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));


// Middlewares connection
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// CORS config
app.use(cors({
  origin: "http://localhost:5173", // your frontend
  credentials: true // Allow sending cookies
}));


// Session config
app.use(session({
  secret: "milansecret",
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false, // Set true if using HTTPS
    maxAge: 1000 * 60 * 60 * 24 // 1 day
  }
}));

// Passport setup
app.use(passport.initialize());
app.use(passport.session());
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());




// Routes
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Signup Route
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

// Login Route
app.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(401).json({ message: "Invalid email or password" });

    req.login(user, (err) => {
      if (err) return next(err);

      // Generate JWT token after successful login
      const token = jwt.sign(
        { id: user._id, name: user.name, email: user.email },
        process.env.JWT_SECRET, // Use your secret here
        { expiresIn: '24h' } // Token expiration time (optional)
      );

      return res.status(200).json({
        message: "Login successful",
        token, // Send the token back to the frontend
        user: {
          id: user._id,
          name: user.name,
          email: user.email
        }
      });
    });
  })(req, res, next);
});



// Protected route 

app.post("/books", authMiddleware, upload.array('images', 3), async (req, res) => {
  const { title, description, price, phone, state, city, pincode, latitude, longitude } = req.body;

  // Validate required fields (latitude and longitude are optional; add if required)
  if (!title || !description || !price || !phone || !state || !city || !pincode) {
    return res.status(400).json({ error: "All fields are required" });
  }

  // Validate image upload
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: "At least one image is required" });
  }

  if (req.files.length > 3) {
    return res.status(400).json({ error: "You can only upload up to 3 images" });
  }

  // Optional: Validate latitude and longitude (if provided)
  if (latitude && (isNaN(latitude) || latitude < -90 || latitude > 90)) {
    return res.status(400).json({ error: "Invalid latitude value" });
  }
  if (longitude && (isNaN(longitude) || longitude < -180 || longitude > 180)) {
    return res.status(400).json({ error: "Invalid longitude value" });
  }

  try {
    const imageUrls = req.files.map(file => file.path); // Map image paths to an array

    const newBook = new Book({
      title,
      description,
      price,
      phone,
      state,
      city,
      pincode,
      images: imageUrls,
      user: req.user.id,
      dateAdded: Date.now(),
      // Save latitude and longitude as numbers, convert from strings if necessary
      latitude: latitude ? parseFloat(latitude) : undefined,
      longitude: longitude ? parseFloat(longitude) : undefined,
    });

    await newBook.save();
    res.status(201).json(newBook);
  } catch (error) {
    console.error("Error saving book:", error);
    res.status(500).json({ error: "Server error" });
  }
});



// Get all books with user details

app.get("/api/books", async (req, res) => {
  try {
    // Fetch all books and populate the user details (name, email)
    const books = await Book.find()
      .populate("user", "name email")  // Populate user fields
      .exec();

    // If there are no books, send a proper message
    if (!books || books.length === 0) {
      return res.status(404).json({ message: "No books found" });
    }

    // Send the books as a JSON response
    res.status(200).json(books);

  } catch (error) {
    console.error("Error fetching books:", error);
    res.status(500).json({ error: "Server error, unable to fetch books" });
  }
});


// Get a single book by ID with user details
app.get("/api/books/:id", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).populate("user",);
    res.status(200).json(book);
  } catch (err) {
    res.status(500).json({ error: "Book not found" });
  }
});


// DELETE route
app.delete('/api/books/:id',  isAuthor, async (req, res) => {
  const { id } = req.params;
  await Book.findByIdAndDelete(id);
  res.status(200).json({ message: 'Post deleted successfully' });
});




// Update route
app.put('/api/books/:id', authMiddleware, upload.array('images', 3), async (req, res) => {
  const { id } = req.params;
  const { title, description, price, phone, state, city, pincode,} = req.body;

  // Validate required fields
  if (!title || !description || !price || !phone || !state || !city || !pincode) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const book = await Book.findById(id);
    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }

    // Update book details
    book.title = title;
    book.description = description;
    book.price = price;
    book.phone = phone;
    book.state = state;
    book.city = city;
    book.pincode = pincode;

    // Handle image uploads
    if (req.files && req.files.length > 0) {
      const imageUrls = req.files.map(file => file.path);
      book.images = imageUrls; // Update images with new uploads
    }



    await book.save();
    res.status(200).json(book);
  } catch (error) {
    console.error("Error updating book:", error);
    res.status(500).json({ error: "Server error" });
  }
});




// Logout Route
app.post("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: "Logout failed" });
    }
    res.status(200).json({ message: "Logout successful" });
  });
});           
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});


// Export the app for testing
