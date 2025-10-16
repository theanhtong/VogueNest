import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import localBackend from "./data/localBackend";
import MainLayout from "./layouts/MainLayout";
import ProductGrid from "./components/Products/ProductGrid";
import Product from "./pages/Product/Product";
import Products from "./pages/Product/Products";
import Cart from "./pages/Cart/Cart";
import Login from "./pages/Auth/Form/Login";
import Register from "./pages/Auth/Form/Register";
import About from "./pages/Another/About";
import Contact from "./pages/Another/Contact";
import Admin from "./pages/Auth/Admin/Admin";
import User from "./pages/Auth/User/User";
import ScrollToTop from "./components/common/ScrollToTop";

export default function VogueNest() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    localBackend.resetAll();
    localBackend.init();

    const productData = localBackend.getAll("products");
    setProducts(productData);
  }, []);

  if (products.length === 0) {
    return <p>Đang tải dữ liệu...</p>;
  }

  return (
    <>
      <ScrollToTop></ScrollToTop>
      <Routes>
        <Route
          path="/"
          element={
            <MainLayout children={<ProductGrid products={products}></ProductGrid>}></MainLayout>
          }
        ></Route>
        <Route
          path="/products/all"
          element={<MainLayout children={<Products products={products}></Products>}></MainLayout>}
        ></Route>
        <Route
          path="/products/:slug"
          element={<MainLayout children={<Product products={products}></Product>}></MainLayout>}
        ></Route>
        <Route path="/cart" element={<MainLayout children={<Cart></Cart>}></MainLayout>}></Route>
        <Route path="/about" element={<MainLayout children={<About></About>}></MainLayout>}></Route>
        <Route
          path="/contact"
          element={<MainLayout children={<Contact></Contact>}></MainLayout>}
        ></Route>
        <Route
          path="/auth/login"
          element={<MainLayout children={<Login></Login>}></MainLayout>}
        ></Route>
        <Route
          path="/auth/register"
          element={<MainLayout children={<Register></Register>}></MainLayout>}
        ></Route>
        <Route path="/user" element={<MainLayout children={<User></User>}></MainLayout>}></Route>
        <Route path="/admin" element={<Admin></Admin>}></Route>
      </Routes>
    </>
  );
}
