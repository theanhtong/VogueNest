import { AlertTriangle } from "lucide-react";

export default function Search({ title = "Feature not yet released", message }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8">
      <div className="flex items-center justify-center w-20 h-20 rounded-full bg-yellow-100 mb-6 shadow-sm">
        <AlertTriangle className="w-10 h-10 text-yellow-600" />
      </div>

      <h1 className="text-2xl font-bold text-gray-800 mb-3">{title}</h1>
      <p className="text-gray-600 max-w-md mb-8">
        {message || "We’re still working on this feature. Please check back later!"}
      </p>

      <button
        onClick={() => window.history.back()}
        className="px-6 py-3 bg-gray-700 text-white font-medium rounded-lg hover:bg-gray-800 active:scale-95 transition-all duration-200 shadow-md"
      >
        Go Back
      </button>
    </div>
  );
}
