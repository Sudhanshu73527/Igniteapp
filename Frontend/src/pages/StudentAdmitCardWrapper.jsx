import { useParams } from "react-router-dom";
import StudentAdmitCard from "./StudentAdmitCard";

const StudentAdmitCardWrapper = () => {
  const { id } = useParams();

  return <StudentAdmitCard studentId={id} />;
};

export default StudentAdmitCardWrapper;