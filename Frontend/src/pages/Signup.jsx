import React, { useState } from "react";
import API from "../services/api";

const Signup = () => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    age: "",
  });

  const handleSignup = async () => {
    try {
      await API.post("/auth/signup", form);
      alert("Signup Success");
    } catch (err) {
      alert(err.response.data.message);
    }
  };

  return (
    <div className="h-screen flex justify-center items-center">
      <div className="bg-white p-6 shadow-lg rounded-lg w-80">
        <h2 className="text-xl font-bold mb-4">Signup</h2>

        <input placeholder="First Name" className="w-full border p-2 mb-2"
          onChange={(e) => setForm({ ...form, firstName: e.target.value })} />

        <input placeholder="Last Name" className="w-full border p-2 mb-2"
          onChange={(e) => setForm({ ...form, lastName: e.target.value })} />

        <input placeholder="Email" className="w-full border p-2 mb-2"
          onChange={(e) => setForm({ ...form, email: e.target.value })} />

        <input type="password" placeholder="Password" className="w-full border p-2 mb-2"
          onChange={(e) => setForm({ ...form, password: e.target.value })} />

        <input placeholder="Age" className="w-full border p-2 mb-2"
          onChange={(e) => setForm({ ...form, age: e.target.value })} />

        <button onClick={handleSignup} className="w-full bg-green-600 text-white py-2">
          Signup
        </button>
      </div>
    </div>
  );
};

export default Signup;