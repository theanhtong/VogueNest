import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import "./global.css";

import VogueNest from "./VogueNest";

import CartProvider from "./contexts/CartContext";
import AuthProvider from "./contexts/AuthContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <VogueNest></VogueNest>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
