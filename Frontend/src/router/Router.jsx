import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import AdminLogin from "../pages/AdminLogin";
import AdminDashboard from "../pages/AdminDashboard";
import ManageUsers from "../pages/ManageUsers";
import ManageCourses from "../pages/ManageCourses";
import ManageSubjects from "../pages/ManageSubjects";
import ManageExams from "../pages/ManageExams";
import ExamSchedule from "../pages/ExamSchedule";
import RegisterStudent from "../pages/RegisterStudent";
import Students from "../pages/Students";
import EditStudent from "../pages/EditStudent";
import ViewStudent from "../pages/ViewStudent";
import ManageNotice from "../pages/ManageNotice";
import NoticeBoard from "../pages/NoticeBoard";
import CreateAdmitCard from "../pages/CreateAdmitCard";
import StudentAdmitCardWrapper from "../pages/StudentAdmitCardWrapper";






const router = createBrowserRouter([
  {
    path: "/",
    children: [
     { index: true, element: <App /> },  
     {path: "/student-login", element: <Login/>},
     {path: "/signup", element: <Signup/>},
     {path: "/admin-login", element: <AdminLogin/>},
     {path: "/admin-dashboard", element: <AdminDashboard/>},
     {path: "/admin/users", element: <ManageUsers/>},
     {path: "/admin/courses", element: <ManageCourses/>},
     {path: "/admin/subjects", element: <ManageSubjects/>},
     {path: "/admin/exams", element: <ManageExams/>},
     {path: "/exams", element: <ExamSchedule/>},
     {path: "/admin/register-student", element: <RegisterStudent/>},
     {path: "/admin/students", element: <Students/>},
     {path: "/admin/edit-student/:id", element: <EditStudent/>},
     {path: "/admin/student/:id", element: <ViewStudent/>},
     {path: "/admin/notices", element: <ManageNotice/>},
     {path: "/notices", element: <NoticeBoard/>},
     {path: "/admin/admit-card", element: <CreateAdmitCard/>},
     {path: "/student/admit-card/:id", element:<StudentAdmitCardWrapper/>}


 ],
  },
]);

export default router;                      


