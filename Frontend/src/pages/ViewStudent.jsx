import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";

const ViewStudent = () => {
  const { id } = useParams();
  const [student, setStudent] = useState(null);

  useEffect(() => {
    API.get(`/students/${id}`).then((res) => {
      setStudent(res.data.student);
    });
  }, [id]);

  if (!student) return <p>Loading...</p>;

  return (
    <div className="p-6">

      <h1 className="text-2xl font-bold mb-6">
        {student.firstName} {student.lastName}
      </h1>

      <div className="grid md:grid-cols-2 gap-4 bg-white p-6 shadow rounded">

        <p><b>Email:</b> {student.email}</p>
        <p><b>Username:</b> {student.username}</p>
        <p><b>Phone:</b> {student.phone}</p>
        <p><b>Father Name:</b> {student.fatherName}</p>
        <p><b>Aadhar:</b> {student.aadharNumber}</p>
        <p><b>Roll:</b> {student.rollNumber}</p>
        <p><b>Course:</b> {student.course}</p>
        <p><b>Passing Year:</b> {student.passingYear}</p>
        <p><b>Degree:</b> {student.degree}</p>
        <p><b>Major:</b> {student.major}</p>
        <p><b>Grade:</b> {student.grade}</p>
        <p><b>Address:</b> {student.address}</p>

      </div>
r
    </div>
  );
};

export default ViewStudent;