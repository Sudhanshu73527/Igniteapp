import React, { useState, useEffect } from "react";
import API from "../services/api";

const RegisterStudent = () => {

  const [courses, setCourses] = useState([]);

  const [form, setForm] = useState({
    username: "",
    password: "",
    email: "",
    firstName: "",
    lastName: "",
    aadharNumber: "",
    rollNumber: "",
    institutionName: "",
    institutionAddress: "",
    passingYear: "",
    fatherName: "",
    phone: "",
    address: "",
    dob: "",
    degree: "",
    major: "",
    grade: "",
    course: "",
  });

  // ✅ FETCH COURSES
  const fetchCourses = async () => {
    try {
      const res = await API.get("/courses");
      setCourses(res.data.courses);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // ✅ SUBMIT
  const handleSubmit = async () => {
    try {
      await API.post("/students/register", form);
      alert("Student Registered Successfully");

      setForm({
        username: "",
        password: "",
        email: "",
        firstName: "",
        lastName: "",
        aadharNumber: "",
        rollNumber: "",
        institutionName: "",
        institutionAddress: "",
        passingYear: "",
        fatherName: "",
        phone: "",
        address: "",
        dob: "",
        degree: "",
        major: "",
        grade: "",
        course: "",
      });

    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  return (
    <div className="p-6">

      <h1 className="text-2xl font-bold mb-6">Register Student</h1>

      <div className="grid md:grid-cols-2 gap-4">

        <input placeholder="Username" className="border p-2"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })} />

        <input placeholder="Password" className="border p-2"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })} />

        <input placeholder="Email" className="border p-2"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })} />

        <input placeholder="First Name" className="border p-2"
          value={form.firstName}
          onChange={(e) => setForm({ ...form, firstName: e.target.value })} />

        <input placeholder="Last Name" className="border p-2"
          value={form.lastName}
          onChange={(e) => setForm({ ...form, lastName: e.target.value })} />

        <input placeholder="Aadhar Number" className="border p-2"
          value={form.aadharNumber}
          onChange={(e) => setForm({ ...form, aadharNumber: e.target.value })} />

        <input placeholder="Roll Number" className="border p-2"
          value={form.rollNumber}
          onChange={(e) => setForm({ ...form, rollNumber: e.target.value })} />

        <input placeholder="Institution Name" className="border p-2"
          value={form.institutionName}
          onChange={(e) => setForm({ ...form, institutionName: e.target.value })} />

        <input placeholder="Institution Address" className="border p-2"
          value={form.institutionAddress}
          onChange={(e) => setForm({ ...form, institutionAddress: e.target.value })} />

        <input placeholder="Passing Year" className="border p-2"
          value={form.passingYear}
          onChange={(e) => setForm({ ...form, passingYear: e.target.value })} />

        <input placeholder="Father Name" className="border p-2"
          value={form.fatherName}
          onChange={(e) => setForm({ ...form, fatherName: e.target.value })} />

        <input placeholder="Phone Number" className="border p-2"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })} />

        <input placeholder="Address" className="border p-2"
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })} />

        <input type="date" className="border p-2"
          value={form.dob}
          onChange={(e) => setForm({ ...form, dob: e.target.value })} />

        <input placeholder="Degree" className="border p-2"
          value={form.degree}
          onChange={(e) => setForm({ ...form, degree: e.target.value })} />

        <input placeholder="Major" className="border p-2"
          value={form.major}
          onChange={(e) => setForm({ ...form, major: e.target.value })} />

        <input placeholder="Grade" className="border p-2"
          value={form.grade}
          onChange={(e) => setForm({ ...form, grade: e.target.value })} />

        {/* ✅ COURSE DROPDOWN */}
        <select
          className="border p-2"
          value={form.course}
          onChange={(e) => setForm({ ...form, course: e.target.value })}
        >
          <option value="">-- Select Course --</option>

          {courses.map((c) => (
            <option key={c._id} value={c.title}>
              {c.title}
            </option>
          ))}
        </select>

      </div>

      <button
        onClick={handleSubmit}
        className="mt-6 bg-green-600 text-white px-6 py-2 rounded"
      >
        Register Student
      </button>

    </div>
  );
};

export default RegisterStudent;