import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import html2pdf from "html2pdf.js";

const StudentAdmitCard = ({ studentId }) => {
  const [data, setData] = useState(null);
  const ref = useRef();

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/admit/student/${studentId}`)
      .then((res) => setData(res.data));
  }, []);

  const downloadPDF = () => {
    html2pdf().from(ref.current).save("admit-card.pdf");
  };

  if (!data) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <div ref={ref} className="border p-6 bg-white">
        <h1 className="text-center text-2xl font-bold">
          IGNITE INSTITUTE
        </h1>
        <h2 className="text-center mb-4">Admit Card</h2>

        <p><b>Name:</b> {data.name}</p>
        <p><b>Roll:</b> {data.rollNumber}</p>
        <p><b>Course:</b> {data.course}</p>
        <p><b>Address:</b> {data.address}</p>
        <p><b>Exam Date:</b> {data.examDate}</p>
      </div>

      <button
        onClick={downloadPDF}
        className="mt-4 bg-blue-500 text-white px-4 py-2"
      >
        Download PDF
      </button>
    </div>
  );
};

export default StudentAdmitCard;