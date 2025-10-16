import { House, LayoutGrid, Headset, Users, Search, User, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";

export default function Header() {
  const menu = [
    { to: "/", icon: House, label: "Home" },
    { to: "/products/all", icon: LayoutGrid, label: "Products" },
    { to: "/about", icon: Users, label: "About Us" },
    { to: "/contact", icon: Headset, label: "Contact" },
  ];

  const { currentUser } = useAuth();
  const { getUserCart } = useCart();

  const userCart = getUserCart(currentUser?.id);
  const cartCounter = userCart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      <div className="w-full border-b border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 sm:py-4 lg-py:6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <Link to={"/"} className="flex items-baseline gap-0 font-bold text-gray-800">
              <span className="text-5xl">V</span>
              <span className="text-4xl">o</span>
              <span className="text-3xl">g</span>
              <span className="text-2xl">u</span>
              <span className="text-xl">e</span>
              <span className="text-5xl">N</span>
              <span className="text-4xl">e</span>
              <span className="text-3xl">s</span>
              <span className="text-2xl">t</span>
            </Link>

            <div className="w-full sm:flex-1 sm:max-w-xl">
              <form className="w-full">
                <div className="relative">
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 pr-10 focus:outline-none focus:ring-1 focus:ring-gray-900"
                    placeholder="Search for products..."
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <Search className="text-gray-900 w-5 h-5" />
                  </div>
                </div>
              </form>
            </div>

            <div className="flex items-center space-x-2">
              {currentUser ? (
                <Link
                  to={currentUser.role === "admin" ? "/admin" : "/user"}
                  className="flex items-center px-3 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all"
                >
                  <User className="w-5 h-5" />
                  <span className="ml-2 font-medium hidden sm:inline">{currentUser.userName}</span>
                </Link>
              ) : (
                <Link
                  to={"/auth/login"}
                  className="flex items-center px-3 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all"
                >
                  <User className="w-5 h-5" />
                  <span className="ml-2 font-medium hidden sm:inline">Login</span>
                </Link>
              )}
              <Link
                to={"/cart"}
                className="flex items-center px-3 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all"
              >
                <div className="relative">
                  <ShoppingCart className="w-5 h-5" />
                  <span className="absolute -top-4 -right-2 bg-gray-800 text-white text-xs font-bold rounded-full w-5 h-5 flex justify-center items-center animate-pulse">
                    {cartCounter}
                  </span>
                </div>
                <span className="ml-2 font-medium hidden sm:inline">Cart</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full border-b border-gray-200">
        <nav className="max-w-7xl mx-auto sm:px-6 lg:px-8 py-4 lg-py:6">
          <ul className="flex justify-center items-center gap-4">
            {menu.map((item, idx) => (
              <Link
                to={item.to}
                key={idx}
                className="flex justify-center items-center space-x-2 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all px-4 py-2 font-medium"
              >
                <item.icon className="w-5 h-5 text-gray-700 hover:text-gray-900" />
                <span className="hidden sm:flex text-sm">{item.label}</span>
              </Link>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
}
