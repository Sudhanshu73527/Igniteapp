import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import html2pdf from "html2pdf.js";

const CreateAdmitCard = () => {
  const [students, setStudents] = useState([]);
  const [selected, setSelected] = useState("");
  const [studentData, setStudentData] = useState(null);
  const [examDate, setExamDate] = useState("");
  const [admitData, setAdmitData] = useState(null);
  const [allAdmits, setAllAdmits] = useState([]);

  const [search, setSearch] = useState("");
  const [filterCourse, setFilterCourse] = useState("");

  const pdfRef = useRef();

  useEffect(() => {
    fetchStudents();
    fetchAdmits();
  }, []);

  // ✅ FETCH STUDENTS
  const fetchStudents = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/students");
      setStudents(Array.isArray(res.data) ? res.data : res.data.students || []);
    } catch (error) {
      console.error(error);
    }
  };

  // ✅ FETCH ADMITS
  const fetchAdmits = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admit/all");
      setAllAdmits(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error(error);
    }
  };

  // ✅ SELECT
  const handleSelect = (id) => {
    setSelected(id);
    const student = students.find((s) => s._id === id);
    setStudentData(student);
  };

  // ✅ CREATE
  const handleCreate = async () => {
    if (!selected || !examDate) {
      alert("Select student & exam date ❌");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/api/admit/create",
        { studentId: selected, examDate }
      );

      setAdmitData(res.data?.admit || null);
      fetchAdmits();

      alert("Admit Card Generated ✅");
    } catch (error) {
      console.error(error);
      alert("Error ❌");
    }
  };

  // ✅ DELETE
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this admit card?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/admit/delete/${id}`);
      fetchAdmits();
    } catch (error) {
      console.error(error);
    }
  };

  // ✅ PDF DOWNLOAD FIX
  const downloadPDF = () => {
    const element = pdfRef.current;

    if (!element) {
      alert("Admit card not ready ❌");
      return;
    }

    const opt = {
      margin: 10,
      filename: `AdmitCard_${admitData?.name || "student"}.pdf`,
      image: { type: "jpeg", quality: 1 },
      html2canvas: { scale: 3 },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };

    html2pdf().set(opt).from(element).save();
  };

  // ✅ SAFE SEARCH FILTER
  const filteredAdmits = allAdmits.filter((a) => {
    const name = a?.name || "";
    const course = a?.course || "";

    return (
      name.toLowerCase().includes(search.toLowerCase()) &&
      (filterCourse === "" ||
        course.toLowerCase().includes(filterCourse.toLowerCase()))
    );
  });

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Create Admit Card</h2>

      {/* SELECT */}
      <select
        onChange={(e) => handleSelect(e.target.value)}
        className="border p-2 mb-4 w-full"
      >
        <option value="">Select Student</option>
        {students.map((s) => (
          <option key={s._id} value={s._id}>
            {s.name}
          </option>
        ))}
      </select>

      {/* DETAILS */}
      {studentData && (
        <div className="bg-gray-100 p-4 mb-4 rounded">
          <p><b>Name:</b> {studentData?.name}</p>
          <p><b>Roll:</b> {studentData?.rollNumber}</p>
          <p><b>Course:</b> {studentData?.course}</p>
          <p><b>Address:</b> {studentData?.address}</p>
        </div>
      )}

      {/* DATE */}
      <input
        type="date"
        className="border p-2 mb-4 w-full"
        onChange={(e) => setExamDate(e.target.value)}
      />

      <button
        onClick={handleCreate}
        className="bg-green-500 text-white px-4 py-2 rounded"
      >
        Generate Admit Card
      </button>

      {/* PREVIEW */}
     {admitData && (
  <>
    <div
      ref={pdfRef}
      className="mt-10 bg-white max-w-3xl mx-auto border-4 border-green-600 shadow-xl p-8"
    >
      {/* HEADER */}
      <div className="text-center border-b-2 border-green-500 pb-4 mb-6">
        <h1 className="text-4xl font-extrabold text-green-700 tracking-wide">
          IGNITE INSTITUTE
        </h1>
        <p className="text-lg font-semibold mt-1 tracking-wide">
          Examination Admit Card
        </p>
      </div>

      {/* STUDENT DETAILS */}
      <div className="grid grid-cols-2 gap-x-10 gap-y-4 text-lg">
        <p>
          <span className="font-semibold">Student Name:</span>{" "}
          {admitData?.name || "N/A"}
        </p>

        <p>
          <span className="font-semibold">Roll Number:</span>{" "}
          {admitData?.rollNumber || "N/A"}
        </p>

        <p>
          <span className="font-semibold">Course:</span>{" "}
          {admitData?.course || "N/A"}
        </p>

        <p>
          <span className="font-semibold">Exam Date:</span>{" "}
          {admitData?.examDate || "N/A"}
        </p>
      </div>

      {/* ADDRESS */}
      <div className="mt-5 text-lg">
        <p>
          <span className="font-semibold">Address:</span>{" "}
          {admitData?.address || "N/A"}
        </p>
      </div>

      {/* INSTRUCTIONS */}
      <div className="mt-6 bg-gray-50 p-4 rounded border text-sm">
        <p className="font-semibold mb-2">Instructions:</p>
        <ul className="list-disc ml-5 space-y-1">
          <li>Bring this admit card to the examination hall.</li>
          <li>Reach 30 minutes before the exam time.</li>
          <li>Carry a valid ID proof with you.</li>
        </ul>
      </div>

      {/* SIGNATURE SECTION */}
      <div className="mt-12 flex justify-between items-center">
        <div className="text-center">
          <div className="w-40 border-t-2 border-black mb-1"></div>
          <p className="text-sm">Student Signature</p>
        </div>

        <div className="text-center">
          <div className="w-40 border-t-2 border-black mb-1"></div>
          <p className="text-sm">Authorized Signature</p>
        </div>
      </div>

      {/* FOOTER */}
      <div className="mt-8 text-center text-xs text-gray-500">
        <p>This admit card generated by IGNITE INSTITUE.</p>
      </div>
    </div>

    {/* DOWNLOAD BUTTON */}
    <div className="text-center mt-5">
      <button
        onClick={downloadPDF}
        className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-700 transition"
      >
        Download Admit Card
      </button>
    </div>
  </>
)}

      {/* SEARCH + FILTER */}
      <div className="flex gap-4 mt-10 mb-4">
        <input
          type="text"
          placeholder="Search name..."
          className="border p-2 w-full"
          onChange={(e) => setSearch(e.target.value)}
        />

        <input
          type="text"
          placeholder="Filter course..."
          className="border p-2"
          onChange={(e) => setFilterCourse(e.target.value)}
        />
      </div>

      {/* LIST */}
      <div className="grid md:grid-cols-2 gap-4">
        {filteredAdmits.map((a) => (
          <div key={a._id} className="border p-4 bg-white shadow rounded">
            <p><b>{a?.name || "N/A"}</b></p>
            <p>{a?.rollNumber || "N/A"}</p>
            <p>{a?.course || "N/A"}</p>

            <div className="flex gap-2 mt-2">
              <button
                onClick={() => setAdmitData(a)}
                className="bg-green-500 text-white px-3 py-1 rounded"
              >
                View
              </button>

              <button
                onClick={() => handleDelete(a._id)}
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

export default CreateAdmitCard;