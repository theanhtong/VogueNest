import { useState } from "react";
import { useCart } from "../../contexts/CartContext";
import { useAuth } from "../../contexts/AuthContext";
import { Link } from "react-router-dom";
import { ShoppingCart, Plus, Minus, Trash2 } from "lucide-react";
import Toast from "../../components/common/Toast";

export default function Cart() {
  const { getUserCart, clearCart, updateQuantity, removeFromCart } = useCart();
  const { currentUser } = useAuth();

  const [toast, setToast] = useState(null);

  const userCart = getUserCart(currentUser?.id);

  const totalPrice = userCart.reduce((total, item) => total + item.price * item.quantity, 0);

  const handleCheckout = () => {
    if (!currentUser) {
      setToast({ message: "You are not logged in!", type: "" });
      return;
    }

    if (userCart.length === 0) {
      setToast({ message: "Your cart is empty!", type: "" });
      return;
    }

    const existingOrders = JSON.parse(localStorage.getItem("orders")) || [];
    const lastId = existingOrders.length > 0 ? existingOrders[existingOrders.length - 1].id : 0;
    const newId = lastId + 1;

    const newOrder = {
      id: newId,
      userId: currentUser.id,
      items: userCart,
      date: new Date().toISOString("vi-VN"),
      status: "completed",
      paymentMethod: "",
    };

    const updatedOrders = [...existingOrders, newOrder];
    localStorage.setItem("orders", JSON.stringify(updatedOrders));

    clearCart(currentUser.id);
    setToast({ message: "Order placed successfully!", type: "success" });
  };

  const handleIncrease = (item) => {
    updateQuantity(currentUser.id, item.id, item.color, item.size, item.quantity + 1);
  };

  const handleDecrease = (item) => {
    if (item.quantity > 1) {
      updateQuantity(currentUser.id, item.id, item.color, item.size, item.quantity - 1);
    }
  };

  const handleRemove = (item) => {
    removeFromCart(currentUser.id, item.id, item.color, item.size);
  };

  const handleClear = () => {
    clearCart(currentUser.id);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Your Shopping Cart</h1>
          {userCart.length > 0 && (
            <button
              onClick={handleClear}
              className="mt-4 sm:mt-0 px-6 py-2.5 bg-red-500 text-white text-sm font-semibold rounded-lg hover:bg-red-600 active:bg-red-700 transition-all duration-200"
            >
              Clear All
            </button>
          )}
        </div>

        {userCart.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 bg-white rounded-xl shadow-sm">
            <ShoppingCart size={80} className="mb-6 text-gray-400" />
            <p className="text-lg font-medium text-gray-600 mb-6">Your cart is currently empty</p>
            <Link
              to="/products/all"
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-all duration-200"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1 space-y-5">
              {userCart.map((item, idx) => (
                <div
                  key={`${item.id}-${idx}`}
                  className="flex flex-col sm:flex-row items-center sm:items-start gap-5 bg-white border border-gray-200 p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200"
                >
                  <div className="w-32 h-32 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    <img src={item.image} alt={item.name} className="object-cover w-full h-full" />
                  </div>

                  <div className="flex-1 w-full">
                    <h4 className="text-lg font-semibold text-gray-900 mb-1">{item.name}</h4>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>
                        Color: <span className="font-medium text-gray-800">{item.color}</span>
                      </p>
                      <p>
                        Size: <span className="font-medium text-gray-800">{item.size}</span>
                      </p>
                    </div>

                    <div className="flex items-center gap-3 mt-3">
                      <button
                        onClick={() => handleDecrease(item)}
                        className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-md hover:bg-gray-100"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="w-8 text-center font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => handleIncrease(item)}
                        className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-md hover:bg-gray-100"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="text-right flex flex-col items-end gap-2">
                    <p className="text-gray-600 text-sm">Price: {item.price.toLocaleString()}₫</p>
                    <p className="text-lg font-semibold text-blue-600">
                      {(item.price * item.quantity).toLocaleString()}₫
                    </p>
                    <button
                      onClick={() => handleRemove(item)}
                      className="flex items-center text-sm text-red-500 hover:text-red-700 mt-2"
                    >
                      <Trash2 size={16} className="mr-1" /> Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="w-full lg:w-96">
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm sticky top-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-5">Order Summary</h3>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600 text-sm">
                    <span>Subtotal:</span>
                    <span>{totalPrice.toLocaleString()}₫</span>
                  </div>
                  <div className="flex justify-between text-gray-600 text-sm">
                    <span>Shipping:</span>
                    <span>Free</span>
                  </div>
                  <div className="flex justify-between text-gray-600 text-sm">
                    <span>Address:</span>
                    <span>{currentUser?.address || "No address provided"}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-3 flex justify-between">
                    <span className="text-base font-semibold text-gray-900">Total:</span>
                    <span className="text-2xl font-bold text-green-600">
                      {totalPrice.toLocaleString()}₫
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <button
                    onClick={handleCheckout}
                    className="w-full px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 active:bg-green-800 shadow-md hover:shadow-lg transition-all duration-200 text-center"
                  >
                    Checkout
                  </button>

                  <Link
                    to="/products/all"
                    className="w-full px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-all duration-200 text-center"
                  >
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
