const express = require('express');
require("dotenv").config();
const mongoose = require("mongoose");
const passport = require("passport");
const cors = require("cors");
const session = require("express-session");
const User=require("./models/user")
const app = express();
const port = 3000;



// Connect to MongoDB
async function main() {
  await mongoose.connect(process.env.MONGODB_URI, 
    { useNewUrlParser: true, useUnifiedTopology: true })
}
   main().then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));



    // Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: "http://localhost:5173",  
    credentials: true
  }));






app.get('/', (req, res) => {
    res.send('Hello World!');
    }
);

app.post("/signup", async (req, res) => {
    const { email, name, number, password } = req.body;
    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(409).json({ message: "User already exists" }); // 409 Conflict
      }
  
      const newUser = new User({ email, name, number });
      await User.register(newUser, password); // passport-local-mongoose
  
      res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  });

  app.post("/login", async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const existingUser = await User.findOne({ email });
      if (!existingUser) {
        return res.status(401).json({ message: "Invalid email" });
      }
  
      // Use passport-local-mongoose's authenticate method
      existingUser.authenticate(password, (err, user) => {
        if (err) return res.status(400).json({ message: "Server error" });
  
        if (!user) {
          return res.status(402).json({ message: "Invalid password" });
        }
  
        return res.status(200).json({ message: "Login successful" });
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Server error" });
    }
  });
  
  
  






app.listen(port, () => {
    console.log(`app listening at http://localhost:${port}`);
    });
