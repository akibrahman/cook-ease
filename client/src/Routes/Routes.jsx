import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import ErrorPage from "../Components/Shared/ErrorPage";
import Dashboard from "../Layouts/Dashboard";
import MyProfile from "../Layouts/User/MyProfile";
import HomePage from "../Pages/HomePage";
import LoginPage from "../Pages/LoginPage";
import RegistrationPage from "../Pages/RegistrationPage";
import UserRoute from "./UserRoute";
import MealManagement from "../Layouts/User/MealManagement";

export const routes = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
    ],
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/registration",
    element: <RegistrationPage />,
  },
  {
    path: "/dashboard",
    element: (
      <UserRoute>
        <Dashboard />
      </UserRoute>
    ),
    children: [
      {
        path: "my-profile",
        element: (
          <UserRoute>
            <MyProfile />
          </UserRoute>
        ),
      },
      {
        path: "meal-management",
        element: (
          <UserRoute>
            <MealManagement />
          </UserRoute>
        ),
      },
    ],
  },
]);
