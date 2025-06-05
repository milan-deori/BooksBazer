import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Header from './components/Header';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Sell from './pages/Sell';
import BookDetails from './pages/BookDetails';
import Wishlist from './pages/Wishlist';
import EditPost from './pages/EditPost';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState, useEffect } from "react";
import Dashboard from "./components/Dashboard";
import StudyPage from "./pages/catagories/Studypage";
import StoryPage from "./pages/catagories/StoryPage";
import BioPage from "./pages/catagories/BioPage";
import ComicPage from "./pages/catagories/ComicPage";
import Regional from "./pages/catagories/Regional";
import Competitive from "./pages/catagories/Competitive";
import SelfPage from "./pages/catagories/SelfPage";
import NotePage from "./pages/catagories/NotePage";
import OthersPage from "./pages/catagories/OthersPage";
import AuthSuccess from "./pages/AuthSuccess";



function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [wishlist, setWishlist] = useState([]);


  // Check login status and user data on initial load

  useEffect(() => {
  const status = localStorage.getItem("isLoggedIn");
  const storedUser = localStorage.getItem("user");
  const loginTime = localStorage.getItem("loginTime");

  const oneDay = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

  if (status === "true" && storedUser && loginTime) {
    const elapsed = Date.now() - parseInt(loginTime);
    if (elapsed < oneDay) {
      setIsLoggedIn(true);
      setUser(JSON.parse(storedUser));
    } else {
      //  Session expired: clear and redirect or logout
      localStorage.clear(); // or remove specific keys only
      setIsLoggedIn(false);
      setUser(null);
    }
  }
}, []);


  //  Load wishlist from localStorage
  useEffect(() => {
    const storedWishlist = localStorage.getItem("wishlist");
    if (storedWishlist) {
      setWishlist(JSON.parse(storedWishlist));
    }
  }, []);

  // Save wishlist to localStorage on any change
  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  return (
    <BrowserRouter>
      <Header
        isLoggedIn={isLoggedIn}
        setIsLoggedIn={setIsLoggedIn}
        user={user}
        setUser={setUser}
      />
      <Routes>
        <Route path="/" element={<Home setWishlist={setWishlist} user={user}/>} />
        <Route path="/login" element={isLoggedIn ? <Navigate to="/" /> : <Login setIsLoggedIn={setIsLoggedIn} setUser={setUser} />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/auth-success" element={<AuthSuccess setIsLoggedIn={setIsLoggedIn} setUser={setUser} />} />
        <Route path="/sell" element={isLoggedIn ? <Sell user={user} /> : <Navigate to="/login" />} />
        <Route path="/book/:id" element={<BookDetails user={user}isLoggedIn={isLoggedIn} setWishlist={setWishlist}/>} />
        <Route path="/edit/:id" element={<EditPost user={user} />} />
        <Route path="/wishlist" element={<Wishlist user={user}  />} />
        <Route path="/dashboard" element={isLoggedIn ? <Dashboard user={user} /> : <Navigate to="/login" />} />
        <Route path="/books/study" element={<StudyPage />} />
        <Route path="/books/story" element={<StoryPage />} />
        <Route path="/books/biography" element={<BioPage />} />
        <Route path="/books/comics" element={<ComicPage />} />
        <Route path="/books/regional" element={<Regional />} />
        <Route path="/books/competitive" element={<Competitive />} />
        <Route path="/books/self-help" element={<SelfPage />} />
        <Route path="/books/notes" element={<NotePage />} />
        <Route path="/books/others" element={<OthersPage />} />



        {/* Redirect any unknown routes to home */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
     
    </BrowserRouter>
  );
}

export default App;




