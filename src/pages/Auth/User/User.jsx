import { useEffect, useState } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import {
  LogOut,
  Edit,
  Save,
  X,
  Mail,
  Phone,
  MapPin,
  User as UserIcon,
  Package,
} from "lucide-react";

export default function User() {
  const { currentUser, logout, setCurrentUser } = useAuth();
  const [orders, setOrders] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({
    userName: "",
    email: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    if (!currentUser) return;

    const allOrders = JSON.parse(localStorage.getItem("orders")) || [];
    const userOrders = allOrders.filter((o) => o.userId === currentUser.id);
    setOrders(userOrders);

    setEditedUser({
      userName: currentUser.userName,
      email: currentUser.email,
      phone: currentUser.phone,
      address: currentUser.address,
    });
  }, [currentUser]);

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-center text-red-600 text-lg font-semibold">You are not logged in!</p>
      </div>
    );
  }

  const handleSave = () => {
    const updatedUser = { ...currentUser, ...editedUser };

    localStorage.setItem("currentUser", JSON.stringify(updatedUser));

    const allUsers = JSON.parse(localStorage.getItem("users")) || [];
    const updatedUsers = allUsers.map((u) => (u.id === updatedUser.id ? updatedUser : u));
    localStorage.setItem("users", JSON.stringify(updatedUsers));

    if (setCurrentUser) setCurrentUser(updatedUser);

    setIsEditing(false);
    alert("✅ Your information has been saved successfully!");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Order history */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
          <div className="flex items-center gap-2 mb-6">
            <Package className="text-blue-600" />
            <h3 className="text-2xl font-bold text-gray-900">Order History</h3>
          </div>

          {orders.length > 0 ? (
            <div className="space-y-8">
              {orders.map((order, idx) => (
                <div
                  key={idx}
                  className="border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200"
                >
                  <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex justify-between text-sm text-gray-600">
                    <p>
                      <span className="font-semibold">Order ID:</span> #{idx + 1}
                    </p>
                    <p>
                      Date:
                      <span className="font-medium">{new Date().toLocaleDateString("en-GB")}</span>
                    </p>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-gray-700">
                      <thead className="bg-gray-100 text-gray-800">
                        <tr className="border-b border-gray-200">
                          <th className="py-3 px-4 text-left">Product Name</th>
                          <th className="py-3 px-4 text-left">Color</th>
                          <th className="py-3 px-4 text-left">Size</th>
                          <th className="py-3 px-4 text-center">Qty</th>
                          <th className="py-3 px-4 text-right">Price</th>
                          <th className="py-3 px-4 text-right">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {order.items.map((item, i) => (
                          <tr
                            key={i}
                            className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                          >
                            <td className="py-3 px-4 font-medium">
                              <div className="flex flex-col gap-2 justify-center items-center">
                                <span className="font-semibold text-center">{item.name}</span>
                                <div className="w-32 h-32 rounded-sm overflow-hidden flex-shrink-0">
                                  <img
                                    src={item.image}
                                    alt={item.name}
                                    className="object-cover w-full h-full"
                                  />
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-4">{item.color}</td>
                            <td className="py-3 px-4">{item.size}</td>
                            <td className="py-3 px-4 text-center">{item.quantity}</td>
                            <td className="py-3 px-4 text-right">
                              {item.price.toLocaleString("vn-VN")} ₫
                            </td>
                            <td className="py-3 px-4 text-right font-semibold text-gray-800">
                              {(item.price * item.quantity).toLocaleString("vn-VN")} ₫
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="bg-gray-50 px-4 py-3 text-right border-t border-gray-200 font-semibold text-green-700">
                    Total:{" "}
                    {order.items
                      .reduce((sum, item) => sum + item.price * item.quantity, 0)
                      .toLocaleString("en-US")}{" "}
                    ₫
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8 text-lg">You have no orders yet.</p>
          )}
        </div>

        <div className="bg-white h-fit rounded-2xl shadow-lg p-6 border border-gray-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <UserIcon className="text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">Personal Information</h2>
            </div>

            <div className="mb-5">
              <label className="font-semibold text-gray-800 flex items-center gap-2 mb-1">
                <Mail size={16} /> Email:
              </label>
              <p className="text-gray-800">{currentUser.email}</p>
            </div>

            <div className="mb-5">
              <label className="font-semibold text-gray-800 flex items-center gap-2 mb-1">
                <UserIcon size={16} /> Username:
              </label>
              {isEditing ? (
                <input
                  type="text"
                  className="border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-300 rounded-md px-3 py-2 w-full transition-all duration-200"
                  value={editedUser.userName}
                  onChange={(e) => setEditedUser({ ...editedUser, userName: e.target.value })}
                />
              ) : (
                <p className="text-gray-800">{currentUser.userName}</p>
              )}
            </div>

            <div className="mb-5">
              <label className="font-semibold text-gray-800 flex items-center gap-2 mb-1">
                <Phone size={16} /> Phone:
              </label>
              {isEditing ? (
                <input
                  type="text"
                  className="border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-300 rounded-md px-3 py-2 w-full transition-all duration-200"
                  value={editedUser.phone}
                  onChange={(e) => setEditedUser({ ...editedUser, phone: e.target.value })}
                />
              ) : (
                <p className="text-gray-800">{currentUser.phone}</p>
              )}
            </div>

            <div>
              <label className="font-semibold text-gray-800 flex items-center gap-2 mb-1">
                <MapPin size={16} /> Shipping Address:
              </label>
              {isEditing ? (
                <input
                  type="text"
                  className="border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-300 rounded-md px-3 py-2 w-full transition-all duration-200"
                  value={editedUser.address}
                  onChange={(e) => setEditedUser({ ...editedUser, address: e.target.value })}
                />
              ) : (
                <p className="text-gray-800">{currentUser.address}</p>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-center items-center gap-4 mt-8">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-5 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  <Save size={18} /> Save
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="flex items-center gap-2 bg-gray-400 hover:bg-gray-500 text-white font-semibold py-2 px-5 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  <X size={18} /> Cancel
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-5 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  <Edit size={18} /> Edit
                </button>

                <button
                  onClick={logout}
                  className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-5 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  <LogOut size={18} /> Log out
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
