import React, { useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });

  const handleLogin = async () => {
    try {
      const res = await API.post("/auth/login", form);
      alert("Login Success");
      console.log(res.data);
    } catch (err) {
      alert(err.response.data.message);
    }
  };

  return (
    <div className="h-screen flex justify-center items-center">
      <div className="bg-white p-6 shadow-lg rounded-lg w-80">
        <h2 className="text-xl font-bold mb-4">Student Login</h2>

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

        <button onClick={handleLogin} className="w-full bg-green-600 text-white py-2">
          Login
        </button>

        <p className="mt-3 text-sm">
          Don't have an account?{" "}
          <Link to="/signup" className="text-green-600">Signup</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;