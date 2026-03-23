import React, { useState, useEffect } from "react";
import API from "../services/api";

const ManageExams = () => {
  const [form, setForm] = useState({
    subjectName: "",
    subjectCode: "",
    type: "Theory",
    examDate: "",
    time: "",
    duration: "",
    description: "",
  });

  const [exams, setExams] = useState([]);
  const [editId, setEditId] = useState(null);

  const fetchExams = async () => {
    const res = await API.get("/exams");
    setExams(res.data.exams);
  };

  useEffect(() => {
    fetchExams();
  }, []);

  const handleSubmit = async () => {
    try {
      if (editId) {
        await API.put(`/exams/${editId}`, form);
        alert("Updated");
      } else {
        await API.post("/exams/add", form);
        alert("Exam Scheduled");
      }

      fetchExams();
      setEditId(null);
      setForm({
        subjectName: "",
        subjectCode: "",
        type: "Theory",
        examDate: "",
        time: "",
        duration: "",
        description: "",
      });

    } catch (err) {
      alert("Error");
    }
  };

  const handleEdit = (e) => {
    setForm(e);
    setEditId(e._id);
  };

  const handleDelete = async (id) => {
    await API.delete(`/exams/${id}`);
    fetchExams();
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Manage Exams</h1>

      {/* FORM */}
      <div className="bg-white p-6 rounded shadow mb-8">
        <input placeholder="Subject Name" className="w-full border p-2 mb-2"
          value={form.subjectName}
          onChange={(e) => setForm({ ...form, subjectName: e.target.value })} />

        <input placeholder="Subject Code" className="w-full border p-2 mb-2"
          value={form.subjectCode}
          onChange={(e) => setForm({ ...form, subjectCode: e.target.value })} />

        <select className="w-full border p-2 mb-2"
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value })}>
          <option>Theory</option>
          <option>Practical</option>
        </select>

        <input type="date" className="w-full border p-2 mb-2"
          value={form.examDate}
          onChange={(e) => setForm({ ...form, examDate: e.target.value })} />

        <input placeholder="Time (e.g. 10:00 AM)" className="w-full border p-2 mb-2"
          value={form.time}
          onChange={(e) => setForm({ ...form, time: e.target.value })} />

        <input placeholder="Duration (e.g. 3 hours)" className="w-full border p-2 mb-2"
          value={form.duration}
          onChange={(e) => setForm({ ...form, duration: e.target.value })} />

        <input placeholder="Description" className="w-full border p-2 mb-2"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })} />

        <button onClick={handleSubmit} className="bg-green-600 text-white px-4 py-2">
          {editId ? "Update" : "Schedule Exam"}
        </button>
      </div>

      {/* LIST */}
      <div className="grid md:grid-cols-2 gap-4">
        {exams.map((e) => (
          <div key={e._id} className="bg-white p-4 shadow rounded">
            <h3 className="font-bold">{e.subjectName}</h3>
            <p>{e.subjectCode}</p>
            <p>{e.type}</p>
            <p>{e.examDate} | {e.time}</p>
            <p>{e.duration}</p>
            <p className="text-sm text-gray-500">{e.description}</p>

            <div className="mt-2 space-x-2">
              <button onClick={() => handleEdit(e)} className="bg-blue-500 text-white px-2 py-1">Edit</button>
              <button onClick={() => handleDelete(e._id)} className="bg-red-500 text-white px-2 py-1">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageExams;