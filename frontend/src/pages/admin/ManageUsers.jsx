import { useEffect, useState } from "react";
import api from "../../api/axios";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    const { data } = await api.get("/admin/users");
    setUsers(data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Delete this user?")) return;
    await api.delete(`/admin/users/${id}`);
    fetchUsers();
  };

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-left">
          <tr>
            <th className="p-4">Name</th>
            <th className="p-4">Email</th>
            <th className="p-4">Role</th>
            <th className="p-4">Joined</th>
            <th className="p-4"></th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u._id} className="border-t">
              <td className="p-4">{u.name}</td>
              <td className="p-4">{u.email}</td>
              <td className="p-4 capitalize">{u.role}</td>
              <td className="p-4">{new Date(u.createdAt).toLocaleDateString()}</td>
              <td className="p-4">
                {u.role !== "admin" && (
                  <button onClick={() => handleDelete(u._id)} className="text-sm bg-red-100 text-red-700 px-3 py-1 rounded-lg">
                    Delete
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageUsers;
