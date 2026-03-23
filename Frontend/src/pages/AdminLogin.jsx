import React, { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleLogin = async () => {
    try {
      const res = await API.post("/admin/login", form);

      alert("Admin Login Success");

      // token save
      localStorage.setItem("adminToken", res.data.token);

      // redirect
      navigate("/admin-dashboard");

    } catch (err) {
      alert(err.response.data.message);
    }
  };

  return (
    <div className="h-screen flex justify-center items-center">
      <div className="bg-white p-6 shadow-lg rounded-lg w-80">
        <h2 className="text-xl font-bold mb-4">Admin Login</h2>

        <input
          type="email"
          placeholder="Email"
          className="w-full border p-2 mb-3"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border p-2 mb-3"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <button
          onClick={handleLogin}
          className="w-full bg-yellow-400 py-2"
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default AdminLogin;