import currency from "../../utils/format";
import { Star } from "lucide-react";
import { Link } from "react-router-dom";

export default function ProductCard({ product }) {
  return (
    <Link
      to={`/products/${product.slug}`}
      className="w-full rounded-sm overflow-hidden shadow-sm hover:shadow-lg duration-300 transform transition bg-white flex flex-col cursor-pointer"
    >
      <div className="relative w-full aspect-square bg-gray-100">
        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
      </div>

      <div className="flex flex-col flex-1 p-4 gap-2">
        <h3 className="text-lg font-semibold text-red-500 truncate">{product.name}</h3>

        <div className="flex items-center gap-2">
          {[...Array(Math.min(product.rating, 5))].map((_, idx) => (
            <Star
              key={`filled-${idx}`}
              className="w-4 h-4 text-yellow-400 stroke-yellow-400 fill-yellow-400"
            />
          ))}

          {product.rating < 5 &&
            [...Array(5 - product.rating)].map((_, idx) => (
              <Star key={`empty-${idx}`} className="w-4 h-4 text-gray-300 stroke-gray-300" />
            ))}
        </div>

        <div className="flex justify-between text-gray-700">
          <span className="text-sm">
            Sold: <span className="text-green-600">{product.sold}</span>
          </span>
          <span className="text-sm">
            Reviews: <span className="text-green-600">{product.reviews}</span>
          </span>
        </div>

        <div className="flex flex-col sm:flex-row items-baseline gap-2 mt-2">
          <span className="text-red-500 font-semibold text-lg">{currency(product.price)}</span>
          {product.oldPrice && (
            <span className="text-gray-400 line-through font-semibold text-sm">
              {currency(product.oldPrice)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
