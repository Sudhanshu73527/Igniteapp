import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-gradient-to-r from-green-600 to-green-800 text-white shadow-lg fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        
        {/* LOGO */}
        <h1 className="text-2xl font-bold tracking-wide">
          MySchool
        </h1>

      

        {/* AUTH BUTTONS */}
        <div className="hidden md:flex space-x-4">
         
         <Link to="/student-login">
  <button className="bg-white text-green-700 px-4 py-1 rounded-lg">
    Student Login
  </button>
</Link>
        

            <Link to="/admin-login">
            <button className="bg-yellow-400 text-black px-4 py-1 rounded-lg hover:bg-yellow-500 transition">
              Admin Login
            </button>
            </Link>
         

         <Link to="/signup">
  <button className="border border-white px-4 py-1 rounded-lg">
    Signup
  </button>
</Link>
          
        </div>

        {/* MOBILE ICON */}
        <div className="md:hidden text-2xl cursor-pointer" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <FaTimes /> : <FaBars />}
        </div>
      </div>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="md:hidden bg-green-700 px-6 pb-6">

          <div className="flex flex-col mt-6 space-y-3">
            
              <Link to="/student-login">
  <button className="bg-white text-green-700 px-4 py-1 rounded-lg">
    Student Login
  </button>
</Link>
          

           <Link to="/admin-login">
              <button className="w-full bg-yellow-400 text-black py-2 rounded-lg">
                Admin Login
              </button>
              </Link>
       

           <Link to="/signup">
  <button className="border border-white px-4 py-1 rounded-lg">
    Signup
  </button>
</Link>
           
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;