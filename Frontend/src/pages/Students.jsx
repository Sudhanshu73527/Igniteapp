import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

const Students = () => {
  const [students, setStudents] = useState([]);
  const [year, setYear] = useState("");
  const navigate = useNavigate();

  const fetchStudents = async () => {
    const res = await API.get("/students");
    setStudents(res.data.students);
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // DELETE
  const handleDelete = async (id) => {
    await API.delete(`/students/${id}`);
    fetchStudents();
  };

  // FILTER
  const filtered = year
    ? students.filter((s) => s.passingYear === year)
    : students;

  return (
    <div className="p-6 bg-gradient-to-br from-green-100 to-white min-h-screen">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">All Registered Students</h1>

        <button
          onClick={() => navigate("/admin/register-student")}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          + Register Student
        </button>
      </div>

      {/* FILTER */}
      <div className="mb-6">
        <select
          className="border p-2"
          value={year}
          onChange={(e) => setYear(e.target.value)}
        >
          <option value="">-- Show All Years --</option>

          {[...new Set(students.map((s) => s.passingYear))].map((y) => (
            <option key={y}>{y}</option>
          ))}
        </select>
      </div>

      {/* CARDS */}
      <div className="grid md:grid-cols-3 gap-6">
        {filtered.map((s, index) => (
          <div key={s._id} className="bg-white p-4 rounded-xl shadow">
            <h2 className="text-xl font-bold text-blue-600">
              {s.firstName} {s.lastName}
            </h2>

            <p>{s.email}</p>
            <p>Username: {s.username}</p>
            <p>{s.course}</p>
            <p>Passing Year: {s.passingYear}</p>

            {/* ACTION */}
            <div className="mt-3 space-x-2">
              <button
                onClick={() => navigate(`/admin/edit-student/${s._id}`)}
                className="bg-blue-500 text-white px-3 py-1 rounded"
              >
                Edit
              </button>

              <button
                onClick={() => handleDelete(s._id)}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Delete
              </button>

              <button
                onClick={() => navigate(`/admin/student/${s._id}`)}
                className="bg-green-500 text-white px-3 py-1 rounded"
              >
                View
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Students;
