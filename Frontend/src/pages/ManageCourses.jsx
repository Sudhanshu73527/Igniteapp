import React, { useState, useEffect } from "react";
import API from "../services/api";

const ManageCourses = () => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    duration: "",
  });

  const [courses, setCourses] = useState([]);
  const [editId, setEditId] = useState(null);

  // fetch
  const fetchCourses = async () => {
    const res = await API.get("/courses");
    setCourses(res.data.courses);
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // ADD / UPDATE
  const handleSubmit = async () => {
    try {
      if (editId) {
        // update
        await API.put(`/courses/${editId}`, form);
        alert("Course Updated");
      } else {
        // add
        await API.post("/courses/add", form);
        alert("Course Added");
      }

      fetchCourses();

      setForm({
        title: "",
        description: "",
        price: "",
        duration: "",
      });

      setEditId(null);

    } catch (err) {
      alert("Error");
    }
  };

  // DELETE
  const handleDelete = async (id) => {
    await API.delete(`/courses/${id}`);
    alert("Deleted");
    fetchCourses();
  };

  // EDIT
  const handleEdit = (course) => {
    setForm(course);
    setEditId(course._id);
  };

  return (
    <div className="p-6">

      <h1 className="text-2xl font-bold mb-6">Manage Courses</h1>

      {/* FORM */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-lg font-semibold mb-4">
          {editId ? "Update Course" : "Add Course"}
        </h2>

        <input
          placeholder="Title"
          className="w-full border p-2 mb-2"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />

        <input
          placeholder="Description"
          className="w-full border p-2 mb-2"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />

        <input
          placeholder="Price"
          className="w-full border p-2 mb-2"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
        />

        <input
          placeholder="Duration"
          className="w-full border p-2 mb-2"
          value={form.duration}
          onChange={(e) => setForm({ ...form, duration: e.target.value })}
        />

        <button
          onClick={handleSubmit}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          {editId ? "Update Course" : "Add Course"}
        </button>
      </div>

      {/* COURSE LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {courses.map((c) => (
          <div key={c._id} className="bg-white p-4 shadow rounded">
            <h3 className="text-lg font-bold">{c.title}</h3>
            <p>{c.description}</p>
            <p>₹ {c.price}</p>
            <p>{c.duration}</p>

            <div className="mt-3 space-x-2">
              <button
                onClick={() => handleEdit(c)}
                className="bg-blue-500 text-white px-3 py-1 rounded"
              >
                Edit
              </button>

              <button
                onClick={() => handleDelete(c._id)}
                className="bg-red-500 text-white px-3 py-1 rounded"
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

export default ManageCourses;