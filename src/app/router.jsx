
import {
  createBrowserRouter,
  Navigate,
} from "react-router-dom";

import PublicLayout from "../layouts/public.jsx";
import LandingPage from "../pages/landingPage.jsx";
import LoginPage from "../pages/login.jsx";
import RegisterPage from "../pages/register.jsx";
import NotFoundPage from "../pages/notfound.jsx";
import AppLayout from "../layouts/applayout.jsx";
import DashboardPage from "../pages/dashboard.jsx";
import DocumentsPage from "../pages/document.jsx";
import BillsPage from "../pages/billspage.jsx";
import NotificationsPage from "../pages/notification.jsx";
import SettingsPage from "../pages/setting.jsx";
import RemindersPage from "../pages/reminders.jsx";

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
    element: <AppLayout />,
    children: [
      { path: "/dashboard", element: <DashboardPage /> },
      { path: "/documents", element: <DocumentsPage /> },
      { path: "/bills", element: <BillsPage /> },
      { path: "/reminders", element: <RemindersPage /> },
      { path: "/notifications", element: <NotificationsPage /> },
      { path: "/settings", element: <SettingsPage /> },
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
