import { useState, useMemo } from "react";
import { ChevronUp, ChevronDown, Search } from "lucide-react";

export default function OrderTabs({ users, orders: propOrders = [] }) {
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("id-asc");

  const enhancedOrders = useMemo(() => {
    return propOrders.map((order) => {
      const user = users?.find((u) => u.id === order.userId);
      const total = order.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
      return { ...order, total, customer: user ? user.userName : "Unknown User" };
    });
  }, [propOrders, users]);

  const filteredOrders = useMemo(() => {
    return enhancedOrders.filter((o) => {
      const matchFilter = filter === "all" || o.status === filter;
      const customerName = (o?.customer || "").toLowerCase();
      const idStr = o?.id?.toString() || "";
      const matchSearch =
        customerName.includes(searchTerm.toLowerCase()) || idStr.includes(searchTerm);
      return matchFilter && matchSearch;
    });
  }, [enhancedOrders, filter, searchTerm]);

  const sortedOrders = useMemo(() => {
    const sorted = [...filteredOrders];
    switch (sortBy) {
      case "date-desc":
        return sorted.sort((a, b) => new Date(b.date) - new Date(a.date));
      case "date-asc":
        return sorted.sort((a, b) => new Date(a.date) - new Date(b.date));
      case "price-desc":
        return sorted.sort((a, b) => b.total - a.total);
      case "price-asc":
        return sorted.sort((a, b) => a.total - b.total);
      default:
        return sorted;
    }
  }, [filteredOrders, sortBy]);

  const toggleSort = (field) => {
    setSortBy((prev) => {
      if (!prev.startsWith(field)) return `${field}-desc`;
      if (prev === `${field}-desc`) return `${field}-asc`;
      return `${field}-desc`;
    });
  };

  const getSortIcon = (field) => {
    const isActive = sortBy.startsWith(field);
    const isAsc = sortBy.endsWith("asc");

    return (
      <span className="inline-block w-4 h-4 ml-1 align-middle">
        {isActive ? (
          isAsc ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )
        ) : null}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Orders Management</h1>
        <p className="text-gray-500 text-sm mt-1">Real-time business insights</p>
      </div>
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

      <div className="bg-white rounded-lg shadow-md overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-left text-gray-600 font-semibold select-none">
              <th
                className="py-3 px-4 cursor-pointer hover:text-gray-900"
                onClick={() => toggleSort("id")}
              >
                Order ID
              </th>
              <th className="py-3 px-4">Customer</th>
              <th className="py-3 px-4">Items</th>
              <th
                className="py-3 px-4 cursor-pointer hover:text-gray-900"
                onClick={() => toggleSort("date")}
              >
                Date {getSortIcon("date")}
              </th>
              <th
                className="py-3 px-4 cursor-pointer hover:text-gray-900"
                onClick={() => toggleSort("price")}
              >
                Total (₫) {getSortIcon("price")}
              </th>
              <th className="py-3 px-4">
                <div className="flex items-center gap-2">
                  <label className="hover:text-gray-900">Status:</label>
                  <select
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-gray-500 focus:border-transparent bg-white"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                  >
                    <option value="all">All</option>
                    <option value="completed">Completed</option>
                    <option value="pending">Pending</option>
                    <option value="canceled">Canceled</option>
                  </select>
                </div>
              </th>
              <th className="py-3 px-4">Payment</th>
            </tr>
          </thead>
          <tbody>
            {sortedOrders.length === 0 ? (
              <tr>
                <td colSpan="7" className="py-4 text-center text-gray-500">
                  No orders found.
                </td>
              </tr>
            ) : (
              sortedOrders.map((order) => (
                <tr
                  key={order.id}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <td className="py-3 px-4">#{order.id}</td>
                  <td className="py-3 px-4">{order.customer}</td>
                  <td className="py-3 px-4">
                    <ul className="space-y-1">
                      {order.items.map((item, index) => (
                        <li key={index}>
                          <span className="font-medium">{item.name}</span>{" "}
                          <span className="text-gray-500">× {item.quantity}</span>
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="py-3 px-4">{order.date}</td>
                  <td className="py-3 px-4 font-semibold">{order.total.toLocaleString()}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        order.status === "completed"
                          ? "bg-green-100 text-green-700"
                          : order.status === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-600">{order.paymentMethod || "—"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="text-sm text-gray-500 text-center">
        Showing {sortedOrders.length} of {enhancedOrders.length} orders
      </div>
    </div>
  );
}
