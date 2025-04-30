import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = ({ setIsLoggedIn, setUser }) => {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      const response = await axios.post("http://localhost:3000/login", form);

      

      // ✅ If login successful, update state & localStorage
      localStorage.setItem("isLoggedIn", true);
      localStorage.setItem("token", response.data.token); // store JWT token
      localStorage.setItem("userId", response.data.user._id); // store user ID
      localStorage.setItem("user", JSON.stringify(response.data.user)); // store name, email etc.
      setIsLoggedIn(true);
      setUser(response.data.user);
      toast.success("Login successful!", { autoClose: 2000 });
      setTimeout(() => navigate("/"), 1000); // Redirect to home after 1 second

      
    } catch (error) {
      if (error.response && error.response.status === 400) {
        toast.error("Please enter all fields");
      } else if (error.response && error.response.status === 401) {
        toast.error("Invalid email");
      } else if (error.response && error.response.status === 402) {
        toast.error("Invalid password");
      } else {
        toast.error("Error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white p-6 rounded-xl shadow-lg"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          className="w-full mb-4 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
          className="w-full mb-4 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-semibold"
        >
          Log In
        </button>

        <p className="text-center text-sm mt-4">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-blue-500 hover:underline">
            Sign Up
          </Link>
        </p>
      </form>

      <ToastContainer position="top-center" />
    </div>
  );
};

export default Login;

