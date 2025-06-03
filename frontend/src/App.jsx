// frontend/src/App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Navbar from "./components/Navbar";
import PrivateRoute from "./components/PrivateRoute";
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";
import UserRegister from "./pages/UserRegister";
import UserLogin from "./pages/UserLogin";
import UserActivateAccount from "./pages/UserActivateAccount";
import UserEdit from "./pages/UserEdit";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/userRegister" element={<UserRegister />} />
        <Route path="/userLogin" element={<UserLogin />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
        <Route path="/activate" element={<UserActivateAccount />} />
        <Route path="/userEdit" element={<UserEdit />} />
        <Route path="/adminDashboard" element={<PrivateRoute><AdminDashboard /></PrivateRoute> } />
        <Route path="/userDashboard" element={<PrivateRoute><UserDashboard /></PrivateRoute>} />
      </Routes>
    </>
  );
}

export default App;
