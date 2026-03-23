import React, { useEffect, useState } from "react";
import axios from "axios";

const NoticeBoard = () => {
  const [notices, setNotices] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/notice/all")
      .then((res) => setNotices(res.data));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Latest Notices</h1>

      {notices.map((n) => (
        <div key={n._id} className="border p-4 mb-3 shadow">
          <h2 className="text-xl font-semibold">{n.title}</h2>
          <p>{n.description}</p>
          <span className="text-sm text-gray-500">{n.date}</span>
        </div>
      ))}
    </div>
  );
};

export default NoticeBoard;