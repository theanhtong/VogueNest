import { useEffect } from "react";

export default function Toast({ message, type = "success", onClose }) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(onClose, 1500);
    return () => clearTimeout(timer);
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div
      className={`fixed top-20 right-5 z-50 px-5 py-3 rounded-md shadow-md text-white font-medium transition-all duration-300 animate-popup ${
        type === "success" ? "bg-green-600" : "bg-red-600"
      }`}
    >
      {message}
      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-popup { animation: slideUp 0.2s ease-out; }
      `}</style>
    </div>
  );
}
