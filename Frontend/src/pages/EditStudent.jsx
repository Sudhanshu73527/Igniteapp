import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";

const EditStudent = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({});

  // ✅ GET SINGLE STUDENT
  useEffect(() => {
    const fetchStudent = async () => {
      const res = await API.get(`/students/${id}`);
      setForm(res.data.student);
    };

    fetchStudent();
  }, [id]);

  // ✅ UPDATE
  const handleUpdate = async () => {
    try {
      await API.put(`/students/${id}`, form);
      alert("Student Updated Successfully");
      navigate("/admin/students");
    } catch (err) {
      alert("Update Failed");
    }
  };

  return (
    <div className="p-6">

      <h1 className="text-2xl mb-4">Edit Student</h1>

      <input
        className="border p-2 mb-2 w-full"
        placeholder="First Name"
        value={form.firstName || ""}
        onChange={(e) => setForm({ ...form, firstName: e.target.value })}
      />

      <input
        className="border p-2 mb-2 w-full"
        placeholder="Last Name"
        value={form.lastName || ""}
        onChange={(e) => setForm({ ...form, lastName: e.target.value })}
      />

      <input
        className="border p-2 mb-2 w-full"
        placeholder="Email"
        value={form.email || ""}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />

      <input
        className="border p-2 mb-2 w-full"
        placeholder="Phone"
        value={form.phone || ""}
        onChange={(e) => setForm({ ...form, phone: e.target.value })}
      />

      <input
        className="border p-2 mb-2 w-full"
        placeholder="Course"
        value={form.course || ""}
        onChange={(e) => setForm({ ...form, course: e.target.value })}
      />

      <button
        onClick={handleUpdate}
        className="bg-green-600 text-white px-4 py-2"
      >
        Update
      </button>

    </div>
  );
};

export default EditStudent;