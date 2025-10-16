import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import {
  Users,
  Package,
  DollarSign,
  CheckCircle,
  TrendingUp,
  PieChart as PieIcon,
  ClipboardList,
  Trophy,
  BarChart3,
} from "lucide-react";

import currency from "../../../utils/format";

export default function DashboardTabs({ users, orders }) {
  const totalUsers = users.length;
  const totalOrders = orders.length;

  const totalRevenue = orders.reduce(
    (sum, order) =>
      sum + order.items.reduce((itemSum, item) => itemSum + item.price * item.quantity, 0),
    0
  );

  const completedOrders = orders.filter((o) => o.status === "completed").length;
  const completedRate = ((completedOrders / totalOrders) * 100).toFixed(1);

  const revenueByMonth = Array.from({ length: 12 }, (_, i) => ({
    month: new Date(0, i).toLocaleString("vi-VN", { month: "short" }),
    revenue: 0,
  }));
  orders.forEach((order) => {
    const monthIndex = new Date(order.date).getMonth();
    const orderRevenue = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    revenueByMonth[monthIndex].revenue += orderRevenue;
  });

  const orderStatusData = [
    { name: "Completed", value: completedOrders },
    { name: "Pending", value: orders.filter((o) => o.status === "pending").length },
    { name: "Canceled", value: orders.filter((o) => o.status === "canceled").length },
  ];

  const COLORS = ["#10b981", "#f59e0b", "#3b82f6"];

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "shipped":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const productSalesMap = {};
  orders.forEach((order) => {
    order.items.forEach((item) => {
      if (!productSalesMap[item.id]) {
        productSalesMap[item.id] = { ...item };
      } else {
        productSalesMap[item.id].quantity += item.quantity;
      }
    });
  });
  const topProducts = Object.values(productSalesMap)
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-6 max-w-7xl mx-auto">
      <div className="space-y-6 mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Dashboard Analytics</h1>
            <p className="text-gray-500 text-sm mt-1">Real-time business insights</p>
          </div>
          <div className="px-4 py-2 bg-white rounded-sm shadow-sm">
            <p className="text-gray-500 text-xs font-medium">LAST UPDATED</p>
            <p className="text-gray-900 text-sm font-semibold">
              {new Date().toLocaleString("vi-VN")}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6">
          <div className="rounded-sm p-6 shadow-sm hover:scale-105 transition-all duration-300">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-600 text-xs font-semibold uppercase tracking-wide mb-2">
                  Total Users
                </p>
                <p className="text-4xl font-bold text-gray-900 mb-1">{totalUsers}</p>
                <div className="flex items-center gap-1 text-green-600 text-sm font-semibold"></div>
              </div>
              <Users className="w-10 h-10 text-blue-600" />
            </div>
          </div>

          <div className="rounded-sm p-6 shadow-sm hover:scale-105 transition-all duration-300">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-600 text-xs font-semibold uppercase tracking-wide mb-2">
                  Total Orders
                </p>
                <p className="text-4xl font-bold text-gray-900 mb-1">{totalOrders}</p>
                <div className="flex items-center gap-1 text-green-600 text-sm font-semibold"></div>
              </div>
              <Package className="w-10 h-10 text-indigo-600" />
            </div>
          </div>

          <div className="rounded-sm p-6 shadow-sm hover:scale-105 transition-all duration-300">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-600 text-xs font-semibold uppercase tracking-wide mb-2">
                  Total Revenue
                </p>
                <p className="text-3xl font-bold text-gray-900 mb-1">{currency(totalRevenue)}</p>
                <div className="flex items-center gap-1 text-green-600 text-sm font-semibold"></div>
              </div>
              <DollarSign className="w-10 h-10 text-green-600" />
            </div>
          </div>

          <div className="rounded-sm p-6 shadow-sm hover:scale-105 transition-all duration-300">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-600 text-xs font-semibold uppercase tracking-wide mb-2">
                  Completed Rate
                </p>
                <p className="text-4xl font-bold text-gray-900 mb-1">{completedRate}%</p>
                <div className="text-green-600 text-sm font-semibold">
                  {completedOrders} orders completed
                </div>
              </div>
              <CheckCircle className="w-10 h-10 text-emerald-600" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          <div className="xl:col-span-3 bg-white rounded-sm p-6 lg:p-8 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BarChart3 className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Revenue Overview</h2>
                <p className="text-gray-500 text-sm">Monthly performance tracking</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-full h-[380px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={revenueByMonth}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis
                      dataKey="month"
                      tick={{ fill: "#6b7280", fontSize: 12 }}
                      angle={-45}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis
                      tick={{ fill: "#6b7280", fontSize: 12 }}
                      tickFormatter={(value) => value.toLocaleString("vi-VN")}
                    />
                    <Tooltip
                      formatter={(v) => currency(v)}
                      contentStyle={{ fontSize: "12px", borderRadius: "6px" }}
                    />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke="#2563eb"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="xl:col-span-1 bg-white rounded-sm p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-purple-100 rounded-lg">
                <PieIcon className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">Order Status</h2>
                <p className="text-gray-500 text-xs">Distribution</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={380}>
              <PieChart>
                <Pie data={orderStatusData} dataKey="value" outerRadius={90}>
                  {COLORS.map((c, i) => (
                    <Cell key={i} fill={c} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => `${v} orders`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="bg-white rounded-sm p-6 lg:p-8 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <ClipboardList className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Recent Orders</h2>
                <p className="text-gray-500 text-sm">Latest transactions</p>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-gray-200 text-left">
                    <th className="pb-4 text-gray-600 font-bold uppercase text-xs tracking-wide">
                      Order ID
                    </th>
                    <th className="pb-4 text-gray-600 font-bold uppercase text-xs tracking-wide">
                      Customer
                    </th>
                    <th className="pb-4 text-gray-600 font-bold uppercase text-xs tracking-wide">
                      Total
                    </th>
                    <th className="pb-4 text-gray-600 font-bold uppercase text-xs tracking-wide">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {orders.slice(0, 5).map((order) => {
                    const customer =
                      users.find((u) => u.id === order.userId)?.userName || "Unknown";
                    const orderTotal = order.items.reduce(
                      (sum, item) => sum + item.price * item.quantity,
                      0
                    );
                    return (
                      <tr
                        key={order.id}
                        className="border-b border-gray-100 hover:bg-gradient-to-r hover:from-blue-50 hover:to-transparent transition-all"
                      >
                        <td className="py-4 text-gray-900 font-bold">#{order.id}</td>
                        <td className="py-4 text-gray-700 font-medium">{customer}</td>
                        <td className="py-4 text-gray-900 font-semibold">{currency(orderTotal)}</td>
                        <td className="py-4">
                          <span
                            className={`px-3 py-1.5 rounded-full text-xs font-bold ${getStatusColor(
                              order.status
                            )}`}
                          >
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white rounded-sm p-6 lg:p-8 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Trophy className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Top 5 Best Sellers</h2>
                <p className="text-gray-500 text-sm">Most popular products</p>
              </div>
            </div>
            {topProducts.map((product, index) => (
              <div
                key={product.id}
                className="flex items-center justify-between p-4 rounded-sm border border-gray-100 hover:border-blue-200 hover:bg-blue-50 transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold shadow-md">
                    {index + 1}
                  </div>
                  <div>
                    <p className="text-gray-900 font-bold text-base">{product.name}</p>
                    <p className="text-gray-500 text-sm font-medium">
                      {product.quantity} units sold
                    </p>
                  </div>
                </div>
                <div className="text-right min-w-[100px]">
                  <div className="w-24 bg-gray-200 rounded-full h-2.5 mb-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2.5 rounded-full shadow-sm"
                      style={{
                        width: `${(product.quantity / topProducts[0].quantity) * 100}%`,
                      }}
                    ></div>
                  </div>
                  <p className="text-gray-700 text-sm font-bold">
                    {((product.quantity / topProducts[0].quantity) * 100).toFixed(0)}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
