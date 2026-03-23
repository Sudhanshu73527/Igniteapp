import React, { useEffect, useState } from "react";
import API from "../services/api";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const res = await API.get("/admin/users");
      setUsers(res.data.users);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">All Registered Users</h1>

      <div className="overflow-x-auto">
        <table className="w-full bg-white shadow-md rounded-lg">
          <thead className="bg-green-600 text-white">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Age</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="text-center border-b">
                <td className="p-3">
                  {user.firstName} {user.lastName}
                </td>
                <td className="p-3">{user.email}</td>
                <td className="p-3">{user.age}</td>

                <td className="p-3 space-x-2">
                  {/* CALL */}
                  <a
                    href={`tel:+91XXXXXXXXXX`}
                    className="bg-green-500 text-white px-3 py-1 rounded"
                  >
                    Call
                  </a>

                  {/* EMAIL */}
                  <a
                    href={`mailto:${user.email}`}
                    className="bg-blue-500 text-white px-3 py-1 rounded"
                  >
                    Email
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageUsers;