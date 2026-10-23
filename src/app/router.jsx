
import {
  createBrowserRouter,
  Navigate,
} from "react-router-dom";

import PublicLayout from "../layouts/public.jsx";
import LandingPage from "../pages/landingPage.jsx";
import LoginPage from "../pages/login.jsx";
import RegisterPage from "../pages/register.jsx";
import NotFoundPage from "../pages/notfound.jsx";

const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      {
        path: "/",
        element: <LandingPage />,
      },
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/register",
        element: <RegisterPage />,
      },
    ],
  },
  {
    path: "/404",
    element: <NotFoundPage />,
  },
  {
    path: "*",
    element: <Navigate to="/404" replace />,
  },
]);

export default router;
