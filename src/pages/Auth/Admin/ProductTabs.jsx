import { useState, useMemo } from "react";
import { ChevronUp, ChevronDown, Search } from "lucide-react";

export default function ProductTabs({ products = [], orders = [] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("id-asc");

  const enhancedProducts = useMemo(() => {
    return products.map((p) => {
      const orderCount = orders.reduce((count, order) => {
        const hasProduct = order.items.some((i) => i.id === p.id);
        return hasProduct ? count + 1 : count;
      }, 0);
      return { ...p, orderCount };
    });
  }, [products, orders]);

  const filteredProducts = useMemo(() => {
    return enhancedProducts.filter((p) => {
      const matchFilter =
        filter === "all" ||
        (filter === "in" && p.quantity > 0) ||
        (filter === "out" && p.quantity === 0);

      const nameMatch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
      const idMatch = p.id.toString().includes(searchTerm);

      return matchFilter && (nameMatch || idMatch);
    });
  }, [enhancedProducts, searchTerm, filter]);

  const sortedProducts = useMemo(() => {
    const sorted = [...filteredProducts];
    switch (sortBy) {
      case "id-desc":
        return sorted.sort((a, b) => b.id - a.id);
      case "id-asc":
        return sorted.sort((a, b) => a.id - b.id);
      case "name-asc":
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case "name-desc":
        return sorted.sort((a, b) => b.name.localeCompare(a.name));
      case "price-asc":
        return sorted.sort((a, b) => a.price - b.price);
      case "price-desc":
      default:
        return sorted;
    }
  }, [filteredProducts, sortBy]);

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
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800"> Products Management</h1>
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
                ID {getSortIcon("id")}
              </th>
              <th
                className="py-3 px-4 cursor-pointer hover:text-gray-900"
                onClick={() => toggleSort("name")}
              >
                Product Name {getSortIcon("name")}
              </th>
              <th
                className="py-3 px-4 cursor-pointer hover:text-gray-900"
                onClick={() => toggleSort("price")}
              >
                Price (₫) {getSortIcon("price")}
              </th>
              <th className="py-3 px-4">Orders</th>
            </tr>
          </thead>

          <tbody>
            {sortedProducts.length === 0 ? (
              <tr>
                <td colSpan="6" className="py-4 text-center text-gray-500">
                  No products found.
                </td>
              </tr>
            ) : (
              sortedProducts.map((p) => (
                <tr
                  key={p.id}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <td className="py-3 px-4">#{p.id}</td>
                  <td className="py-3 px-4">{p.name}</td>
                  <td className="py-3 px-4 font-semibold">{p.price.toLocaleString()}</td>
                  <td className="py-3 px-4 text-start">{p.orderCount}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="text-sm text-gray-500 text-center">
        Showing {sortedProducts.length} of {enhancedProducts.length} products
      </div>
    </div>
  );
}
