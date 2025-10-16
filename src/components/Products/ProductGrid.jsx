import ProductCard from "./ProductCard";

export default function ProductGrid({ products }) {
  return (
    <div className="max-w-6xl flex justify-center items-center mx-auto ">
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((product, idx) => (
          <ProductCard key={idx} product={product}></ProductCard>
        ))}
      </div>
    </div>
  );
}
