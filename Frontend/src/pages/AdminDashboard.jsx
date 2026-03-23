import React from "react";
import { motion } from "framer-motion";
import {
  FaUsers,
  FaBook,
  FaImage,
  FaSignOutAlt,
  FaBell,
  FaChartLine,
} from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";





const AdminDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin-login");
  };

  const menuItems = [
    { name: "Dashboard", path: "/admin-dashboard" },
    { name: "Users", path: "/admin/users" },
    { name: "Courses", path: "/admin/courses" },
    { name: "Subjects", path: "/admin/subjects" },
    { name: "Exams", path: "/admin/exams" },
    { name: "Students", path: "/admin/students" },
    { name: "Notices", path: "/admin/notices" },
    { name: "Admit Card", path: "/admin/admit-card" },
  
  ];

  const cards = [
    {
      title: "Total Students",
      icon: <FaUsers size={28} />,
      value: "120+",
    },
    {
      title: "Courses",
      icon: <FaBook size={28} />,
      value: "15",
    },
    {
      title: "Notices",
      icon: <FaBell size={28} />,
      value: "8",
    },
    {
      title: "Performance",
      icon: <FaChartLine size={28} />,
      value: "Good",
    },
  ];

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* SIDEBAR */}
      <div className="w-64 bg-white shadow-xl hidden md:flex flex-col justify-between">
        <div>
          <h2 className="text-2xl font-bold text-green-600 p-6">
            Admin Panel
          </h2>

          <ul className="space-y-2 px-4">
            {menuItems.map((item, i) => (
              <li
                key={i}
                onClick={() => navigate(item.path)}
                className={`p-2 rounded-lg cursor-pointer transition ${
                  location.pathname === item.path
                    ? "bg-green-100 text-green-600 font-semibold"
                    : "hover:bg-gray-100"
                }`}
              >
                {item.name}
              </li>
            ))}
          </ul>
        </div>

        <button
          onClick={handleLogout}
          className="m-4 flex items-center gap-2 text-red-500 hover:text-red-600"
        >
          <FaSignOutAlt /> Logout
        </button>
      </div>

      {/* MAIN */}
      <div className="flex-1">
        {/* TOPBAR */}
        <div className="bg-white shadow px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-700">
            Dashboard 👑
          </h1>

          <div className="flex items-center gap-4">
            <FaBell className="text-gray-500 cursor-pointer" />
            <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm">
              Admin
            </div>
          </div>
        </div>

        {/* CONTENT */}
        <div className="p-6">
          {/* STATS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {cards.map((card, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05 }}
                className="bg-white p-5 rounded-2xl shadow hover:shadow-xl transition"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-gray-500 text-sm">
                      {card.title}
                    </h3>
                    <p className="text-2xl font-bold text-gray-800">
                      {card.value}
                    </p>
                  </div>
                  <div className="text-green-600">{card.icon}</div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* QUICK ACTIONS */}
          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div
              whileHover={{ scale: 1.05 }}
              onClick={() => navigate("/admin/users")}
              className="bg-gradient-to-r from-green-400 to-green-600 text-white p-6 rounded-2xl cursor-pointer"
            >
              Manage Users
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              onClick={() => navigate("/admin/courses")}
              className="bg-gradient-to-r from-blue-400 to-blue-600 text-white p-6 rounded-2xl cursor-pointer"
            >
              Manage Courses
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              onClick={() => navigate("/admin/notices")}
              className="bg-gradient-to-r from-purple-400 to-purple-600 text-white p-6 rounded-2xl cursor-pointer"
            >
              Manage Notices
            </motion.div>
          </div>

          {/* INFO SECTION */}
          <div className="mt-10 bg-white p-6 rounded-2xl shadow">
            <h2 className="text-xl font-semibold mb-2">
              System Overview
            </h2>
            <p className="text-gray-600">
              Manage students, courses, exams and notices from one
              place. This dashboard gives you full control over your
              institute system.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;