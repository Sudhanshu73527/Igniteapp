import React, { useState, useEffect } from "react";
import API from "../services/api";

const ManageSubjects = () => {
  const [form, setForm] = useState({
    name: "",
    code: "",
    type: "Theory",
    minMarks: "",
    maxMarks: "",
  });

  const [subjects, setSubjects] = useState([]);
  const [editId, setEditId] = useState(null);

  const fetchSubjects = async () => {
    const res = await API.get("/subjects");
    setSubjects(res.data.subjects);
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  const handleSubmit = async () => {
    try {
      if (editId) {
        await API.put(`/subjects/${editId}`, form);
        alert("Updated");
      } else {
        await API.post("/subjects/add", form);
        alert("Added");
      }

      fetchSubjects();

      setForm({
        name: "",
        code: "",
        type: "Theory",
        minMarks: "",
        maxMarks: "",
      });

      setEditId(null);

    } catch (err) {
      alert("Error");
    }
  };

  const handleEdit = (s) => {
    setForm(s);
    setEditId(s._id);
  };

  const handleDelete = async (id) => {
    await API.delete(`/subjects/${id}`);
    alert("Deleted");
    fetchSubjects();
  };

  return (
    <div className="p-6">

      <h1 className="text-2xl font-bold mb-6">Manage Subjects</h1>

      {/* FORM */}
      <div className="bg-white p-6 rounded shadow mb-8">
        <h2 className="mb-4 font-semibold">
          {editId ? "Update Subject" : "Add Subject"}
        </h2>

        <input
          placeholder="Subject Name"
          className="w-full border p-2 mb-2"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          placeholder="Subject Code"
          className="w-full border p-2 mb-2"
          value={form.code}
          onChange={(e) => setForm({ ...form, code: e.target.value })}
        />

        <select
          className="w-full border p-2 mb-2"
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value })}
        >
          <option>Theory</option>
          <option>Practical</option>
        </select>

        <input
          placeholder="Min Marks"
          className="w-full border p-2 mb-2"
          value={form.minMarks}
          onChange={(e) => setForm({ ...form, minMarks: e.target.value })}
        />

        <input
          placeholder="Max Marks"
          className="w-full border p-2 mb-2"
          value={form.maxMarks}
          onChange={(e) => setForm({ ...form, maxMarks: e.target.value })}
        />

        <button
          onClick={handleSubmit}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          {editId ? "Update" : "Add"}
        </button>
      </div>

      {/* LIST */}
      <div className="grid md:grid-cols-2 gap-4">
        {subjects.map((s) => (
          <div key={s._id} className="bg-white p-4 shadow rounded">
            <h3 className="font-bold">{s.name}</h3>
            <p>{s.code}</p>
            <p>{s.type}</p>
            <p>{s.minMarks} - {s.maxMarks}</p>

            <div className="mt-2 space-x-2">
              <button
                onClick={() => handleEdit(s)}
                className="bg-blue-500 text-white px-2 py-1 rounded"
              >
                Edit
              </button>

              <button
                onClick={() => handleDelete(s._id)}
                className="bg-red-500 text-white px-2 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default ManageSubjects;