import React, { useEffect, useState } from "react";
import API from "../services/api";

const ExamSchedule = () => {
  const [exams, setExams] = useState([]);

  useEffect(() => {
    API.get("/exams").then((res) => setExams(res.data.exams));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Exam Schedule</h1>

      {exams.map((e) => (
        <div key={e._id} className="bg-white p-4 shadow mb-4 rounded">
          <h2 className="font-bold text-lg">{e.subjectName}</h2>
          <p>{e.subjectCode} | {e.type}</p>
          <p>Date: {e.examDate}</p>
          <p>Time: {e.time}</p>
          <p>Duration: {e.duration}</p>
          <p className="text-sm text-gray-500">{e.description}</p>
        </div>
      ))}
    </div>
  );
};

export default ExamSchedule;