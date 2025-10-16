import { useState } from "react";
import ProductGrid from "../../components/Products/ProductGrid";

export default function Products({ products }) {
  const [selectedCategory, setSelectedCategory] = useState(null);

  const categories = [...new Set(products.map((p) => p.category))];

  const filteredProducts = selectedCategory
    ? products.filter((p) => p.category === selectedCategory)
    : products;

  const handleCategoryClick = (category) => {
    setSelectedCategory((prev) => (prev === category ? null : category));
  };

  return (
    <div className="flex flex-col lg:flex-row gap-2 px-2 sm:px-4 lg:px-6 py-6">
      <aside className="w-full h-fit lg:w-[15%] bg-white rounded-md shadow-sm p-6">
        <h2 className="text-lg font-semibold pb-2">Danh mục</h2>
        <ul className="space-y-2">
          {categories.map((category, idx) => (
            <li
              key={idx}
              onClick={() => handleCategoryClick(category)}
              className={`cursor-pointer rounded-md p-2 transition ${
                selectedCategory === category ? "bg-gray-700 text-white" : "hover:bg-gray-100"
              }`}
            >
              {category}
            </li>
          ))}
        </ul>
      </aside>

      <main className="flex-1">
        <ProductGrid products={filteredProducts} />
      </main>
    </div>
  );
}
