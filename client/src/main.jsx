import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import React from "react";
import "react-awesome-button/dist/styles.css";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "swiper/css";
import "swiper/css/effect-creative";
import "swiper/css/navigation";
import AuthProvider from "./Providers/AuthProvider.jsx";
import { routes } from "./Routes/Routes.jsx";
import "./index.css";

const tanstack = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  // <React.StrictMode>
  <QueryClientProvider client={tanstack}>
    <AuthProvider>
      <ToastContainer position="top-center" autoClose={2000} />
      <RouterProvider router={routes} />
    </AuthProvider>
  </QueryClientProvider>
  // </React.StrictMode>
);
