import React, { useState, useEffect } from "react";
import axios from "axios";

const ManageNotice = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [notices, setNotices] = useState([]);

  const fetchNotices = async () => {
    const res = await axios.get("http://localhost:5000/api/notice/all");
    setNotices(res.data);
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const handleAdd = async () => {
    await axios.post("http://localhost:5000/api/notice/add", {
      title,
      description,
    });

    setTitle("");
    setDescription("");
    fetchNotices();
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:5000/api/notice/delete/${id}`);
    fetchNotices();
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Manage Notices</h2>

      <input
        type="text"
        placeholder="Title"
        className="border p-2 w-full mb-2"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        placeholder="Description"
        className="border p-2 w-full mb-2"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <button
        onClick={handleAdd}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Add Notice
      </button>

      <div className="mt-6">
        {notices.map((n) => (
          <div key={n._id} className="border p-3 mb-2">
            <h3 className="font-bold">{n.title}</h3>
            <p>{n.description}</p>
            <button
              onClick={() => handleDelete(n._id)}
              className="bg-red-500 text-white px-2 py-1 mt-2"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageNotice;