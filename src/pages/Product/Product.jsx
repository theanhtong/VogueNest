import { useLocation, useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Star, Plus, Minus, CheckCircle } from "lucide-react";
import currency from "../../utils/format";
import { useCart } from "../../contexts/CartContext";
import { useAuth } from "../../contexts/AuthContext";
import AuthModal from "../../components/common/AuthModal";
import Toast from "../../components/common/Toast";

export default function Product({ products }) {
  const { slug } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { currentUser } = useAuth();

  const product = state ?? products.find((p) => p.slug === slug);
  if (!product)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="text-lg font-semibold text-red-500">Product not found</span>
      </div>
    );

  const [color, setColor] = useState(product.colors[0]);
  const [size, setSize] = useState(product.sizes[0]);
  const [quantity, setQuantity] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState(null);

  const requireLogin = () => {
    if (!currentUser) {
      setShowModal(true);
      return true;
    }
    return false;
  };

  const handleAddToCart = () => {
    if (requireLogin()) return;
    addToCart(currentUser.id, product, color, size, quantity);
    setToast({ message: "Added to cart!", type: "success" });
  };

  const handleCheckout = () => {
    if (requireLogin()) return;

    const orders = JSON.parse(localStorage.getItem("orders")) || [];
    const newId = (orders.at(-1)?.id || 0) + 1;
    const statuses = ["completed", "pending", "canceled"];

    const newOrder = {
      id: newId,
      userId: currentUser.id,
      items: [
        {
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          color,
          size,
          quantity,
        },
      ],
      date: new Date().toISOString().split("T")[0],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      paymentMethod: "",
    };

    localStorage.setItem("orders", JSON.stringify([...orders, newOrder]));
    navigate("/user");
  };

  // === SUB COMPONENTS ===
  const Info = ({ label, value }) => (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-600">{label}:</span>
      <span className="text-lg font-semibold text-green-500">{value}</span>
    </div>
  );

  const OptionGroup = ({ label, options, selected, onSelect }) => (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-gray-900">{label}</h3>
      <div className="flex flex-wrap gap-3">
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => onSelect(opt)}
            className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all duration-200 ${
              selected === opt
                ? "border-gray-700 bg-gray-200 text-gray-900"
                : "border-gray-300 text-gray-700 hover:border-gray-500 hover:bg-gray-50"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );

  const ActionButton = ({ onClick, color, children }) => {
    const base =
      "flex-1 px-6 py-4 text-white font-semibold rounded-lg transition-all duration-200 shadow-md transform hover:scale-105 active:scale-95";
    const variants = {
      gray: "bg-gray-600 hover:bg-gray-700 active:bg-gray-800",
      red: "bg-red-600 hover:bg-red-700 active:bg-red-800",
    };
    return (
      <button onClick={onClick} className={`${base} ${variants[color]}`}>
        {children}
      </button>
    );
  };

  // === MAIN JSX ===
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 p-6 lg:p-12">
          {/* IMAGE SECTION */}
          <div className="flex justify-center">
            <div className="relative w-full h-fit aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg overflow-hidden shadow-sm">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-500 ease-in-out"
              />
            </div>
          </div>

          {/* PRODUCT DETAILS */}
          <div className="flex flex-col gap-6">
            <div className="space-y-3">
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">{product.name}</h1>
              <p className="text-base text-gray-600 leading-relaxed">{product.description}</p>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex gap-1">
                {[...Array(product.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <span className="text-sm text-gray-600">({product.reviews} reviews)</span>
            </div>

            <div className="flex flex-wrap gap-6 py-4 border-y border-gray-200">
              <Info label="Reviews" value={product.reviews} />
              <Info label="Sold" value={product.sold} />
            </div>

            <div className="flex items-baseline gap-4">
              <div className="text-4xl font-semibold text-red-600">{currency(product.price)}</div>
              {product.oldPrice && (
                <div className="text-xl font-semibold line-through text-gray-400">
                  {currency(product.oldPrice)}
                </div>
              )}
            </div>

            <OptionGroup
              label="Color"
              options={product.colors}
              selected={color}
              onSelect={setColor}
            />
            <OptionGroup label="Size" options={product.sizes} selected={size} onSelect={setSize} />

            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-900">Quantity</h3>
              <div className="flex items-center gap-4 border border-gray-300 rounded-lg p-2 w-fit bg-white shadow-sm">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-md hover:bg-gray-100"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="text-lg font-semibold w-8 text-center select-none">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-md hover:bg-gray-100"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <ActionButton onClick={handleAddToCart} color="gray">
                Add to Cart
              </ActionButton>
              <ActionButton onClick={handleCheckout} color="red">
                Buy Now
              </ActionButton>
            </div>

            <div className="space-y-3 pt-4 border-t border-gray-200">
              {[
                "Free shipping for orders over 500K",
                "100% money-back guarantee",
                "12-month official warranty",
              ].map((text, i) => (
                <div key={i} className="flex items-center gap-3 text-sm text-gray-700">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      {showModal && <AuthModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
