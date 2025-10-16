import { useNavigate } from "react-router-dom";

export default function AuthModal({ onClose }) {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 bg-transparent bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-2xl max-w-sm w-full mx-4 overflow-hidden animate-popup">
        {/* Header */}
        <div className="bg-gradient-to-r from-gray-500 to-gray-600 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Login Required</h2>
        </div>

        {/* Body */}
        <div className="px-6 py-6">
          <p className="text-gray-700 text-center mb-6">You need to log in to use this feature!</p>

          {/* Buttons */}
          <div className="flex flex-col gap-3">
            <button
              onClick={() => navigate("/auth/login")}
              className="w-full px-4 py-3 bg-blue-500 text-white font-semibold rounded-sm hover:bg-blue-600 transition-colors"
            >
              Go to Login
            </button>
            <button
              onClick={onClose}
              className="w-full px-4 py-3 bg-gray-200 text-gray-800 font-semibold rounded-sm hover:bg-gray-300 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>

      {/* Animation */}
      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-popup {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
