import { useEffect, useState, useMemo } from "react";
import { Trash2, SquarePen, Search } from "lucide-react";

export default function UserTabs() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    role: "user",
  });

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("users")) || [];
    setUsers(saved);
  }, []);

  useEffect(() => {
    if (users.length > 0) {
      localStorage.setItem("users", JSON.stringify(users));
    }
  }, [users]);

  const filteredUsers = useMemo(() => {
    return users.filter((u) =>
      (u?.userName || "").toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCancel = () => {
    resetForm();
    setOpenModal(false);
  };

  const resetForm = () => {
    setFormData({
      userName: "",
      email: "",
      password: "",
      phone: "",
      address: "",
      role: "user",
    });
    setEditingUser(null);
    setOpenModal(false);
  };

  const handleAddUser = () => {
    if (!formData.userName || !formData.email || !formData.password) {
      alert("Please fill in all required fields (Name, Email, Password).");
      return;
    }

    const lastId = users.length > 0 ? Math.max(...users.map((u) => u.id)) : 0;

    const newUser = {
      id: lastId + 1,
      ...formData,
      createdAt: new Date().toLocaleDateString("en-US"),
    };

    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    localStorage.setItem("users", JSON.stringify(updatedUsers));
    resetForm();
  };

  const handleEditUser = () => {
    if (!formData.userName || !formData.email) {
      alert("Please fill in all required fields (Name, Email).");
      return;
    }

    const updatedUsers = users.map((u) =>
      u.id === editingUser.id ? { ...u, ...formData, password: formData.password || u.password } : u
    );

    setUsers(updatedUsers);
    localStorage.setItem("users", JSON.stringify(updatedUsers));
    resetForm();
  };

  const handleDeleteUser = (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      const updatedUsers = users.filter((u) => u.id !== id);
      setUsers(updatedUsers);
      localStorage.setItem("users", JSON.stringify(updatedUsers));
    }
  };

  const openEditModal = (user) => {
    setEditingUser(user);
    setFormData({
      userName: user.userName,
      email: user.email,
      password: "",
      phone: user.phone || "",
      address: user.address || "",
      role: user.role || "user",
    });
    setOpenModal(true);
  };

  const openAddModal = () => {
    resetForm();
    setOpenModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">User Management</h1>
        <p className="text-gray-500 text-sm mt-1">Manage user accounts and roles</p>
      </div>

      <div className="flex justify-between items-center gap-3">
        <div className="relative flex items-center w-full sm:w-64">
          <Search size={18} className="absolute left-3 text-gray-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search user by name"
            className="border border-gray-300 rounded-lg pl-9 pr-3 py-2 w-full focus:ring-2 focus:ring-blue-400 focus:outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button
          onClick={openAddModal}
          className="px-4 py-2 text-white bg-blue-500 rounded-md cursor-pointer shadow-sm hover:bg-blue-600 transition-colors"
        >
          Add User
        </button>
      </div>

      {openModal && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            {editingUser ? "✏️ Edit User" : "➕ Add New User"}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="userName"
              className="border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 px-3 py-2 rounded-md w-full outline-none transition"
              placeholder="User Name *"
              value={formData.userName}
              onChange={handleInputChange}
            />

            <input
              type="email"
              name="email"
              className="border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 px-3 py-2 rounded-md w-full outline-none transition"
              placeholder="Email *"
              value={formData.email}
              onChange={handleInputChange}
            />

            <input
              type="password"
              name="password"
              className="border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 px-3 py-2 rounded-md w-full outline-none transition"
              placeholder={
                editingUser ? "New Password (leave blank to keep current)" : "Password *"
              }
              value={formData.password}
              onChange={handleInputChange}
            />

            <input
              type="tel"
              name="phone"
              className="border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 px-3 py-2 rounded-md w-full outline-none transition"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleInputChange}
            />

            <input
              type="text"
              name="address"
              className="border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 px-3 py-2 rounded-md w-full outline-none transition"
              placeholder="Address"
              value={formData.address}
              onChange={handleInputChange}
            />

            <select
              name="role"
              className="border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 px-3 py-2 rounded-md w-full outline-none transition bg-white"
              value={formData.role}
              onChange={handleInputChange}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {/* Action buttons */}
          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md transition"
            >
              Cancel
            </button>

            <button
              onClick={editingUser ? handleEditUser : handleAddUser}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md shadow-sm transition"
            >
              {editingUser ? "Update" : "Save"}
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-4 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-left text-gray-600 font-semibold">
              <th className="py-3 px-4">ID</th>
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">Email</th>
              <th className="py-3 px-4">Password</th>
              <th className="py-3 px-4">Phone</th>
              <th className="py-3 px-4">Address</th>
              <th className="py-3 px-4">Role</th>
              <th className="py-3 px-4">Joined</th>
              <th className="py-3 px-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan="9" className="py-4 text-center text-gray-500">
                  No users found.
                </td>
              </tr>
            )}
            {filteredUsers.map((u) => (
              <tr
                key={u.id}
                className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
              >
                <td className="py-3 px-4">{u.id}</td>
                <td className="py-3 px-4">{u.userName}</td>
                <td className="py-3 px-4">{u.email}</td>
                <td className="py-3 px-4">{"*".repeat(u.password?.length || 8)}</td>
                <td className="py-3 px-4">{u.phone || "-"}</td>
                <td className="py-3 px-4">{u.address || "-"}</td>
                <td className="py-3 px-4 capitalize">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      u.role === "admin" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {u.role || "user"}
                  </span>
                </td>
                <td className="py-3 px-4 text-gray-600">{u.createdAt || "-"}</td>
                <td className="py-3 px-4 text-gray-600">
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEditModal(u)}
                      className="w-5 h-5 cursor-pointer text-blue-600 hover:text-blue-800"
                      title="Edit"
                    >
                      <SquarePen size={20} />
                    </button>
                    <button
                      onClick={() => handleDeleteUser(u.id)}
                      className="w-5 h-5 cursor-pointer text-red-600 hover:text-red-800"
                      title="Delete"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
