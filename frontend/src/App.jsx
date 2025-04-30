import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from './components/Header';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState, useEffect } from "react";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const status = localStorage.getItem("isLoggedIn");
    const storedUser = localStorage.getItem("user");
    if (status === "true" && storedUser) {
      setIsLoggedIn(true);
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <BrowserRouter>
      <Header
  isLoggedIn={isLoggedIn}
  setIsLoggedIn={setIsLoggedIn}
  user={user}
  setUser={setUser}
/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={
          <Login setIsLoggedIn={setIsLoggedIn} setUser={setUser} />

        } />
        <Route path="/signup" element={<Signup />} />
      </Routes>
      <ToastContainer position="top-center" autoClose={2000} />
    </BrowserRouter>
  );
}

export default App;



