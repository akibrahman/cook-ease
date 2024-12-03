import { Link, useNavigate } from "react-router-dom";

const ErrorPage = () => {
  const navigate = useNavigate();
  return (
    <div>
      <div className="error-page bg-gray-200 h-screen flex items-center justify-center">
        <div className="error-container text-center p-8 bg-white shadow-md rounded-md">
          <h1 className="text-4xl font-bold text-red-500 mb-4">
            Oops! Something went wrong.
          </h1>
          <p className="text-gray-700 mb-6">
            We apologize for the inconvenience.
          </p>
          <img src="/404.jpg" className="w-[300px] md:w-[400px] mx-auto" />
          <div className="flex items-center justify-center gap-5">
            <button
              onClick={() => navigate(-1)}
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 focus:outline-none"
            >
              Go Back
            </button>
            <Link
              to="/"
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 focus:outline-none"
            >
              Go Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
