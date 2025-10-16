import { useEffect, useState } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import DashboardTabs from "./DashboardTabs";
import OrderTabs from "../Admin/OrderTabs";
import UserTabs from "../Admin/UserTabs";
import ProductTabs from "../Admin/ProductTabs";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [activeTab, setActiveTab] = useState("dashboard");
  const { logout } = useAuth();

  useEffect(() => {
    const ordersData = JSON.parse(localStorage.getItem("orders")) || [];
    setOrders(ordersData);
    const usersData = JSON.parse(localStorage.getItem("users")) || [];
    setUsers(usersData);
    const productsData = JSON.parse(localStorage.getItem("products")) || [];
    setProducts(productsData);
  }, []);

  const navItems = [
    { id: "dashboard", label: "Dashboard" },
    { id: "orders", label: "Orders" },
    { id: "products", label: "Products" },
    { id: "users", label: "Users" },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <aside className="w-64 bg-gray-900 text-white flex flex-col shadow-lg">
        <div className="p-6 border-b border-gray-700">
          <h1 className="text-2xl font-bold">Admin Panel</h1>
        </div>

        <nav className="flex-1 space-y-1 p-4">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                activeTab === item.id ? "bg-gray-600 text-white" : "text-gray-300 hover:bg-gray-800"
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-700">
          <button
            onClick={logout}
            className="w-full px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
          >
            Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {activeTab === "dashboard" && <DashboardTabs users={users} orders={orders} />}
          {activeTab === "orders" && <OrderTabs orders={orders} users={users} />}
          {activeTab === "products" && <ProductTabs products={products} orders={orders} />}
          {activeTab === "users" && <UserTabs users={users} orders={orders} />}
        </div>
      </main>
    </div>
  );
}
