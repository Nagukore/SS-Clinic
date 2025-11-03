// src/router.tsx
import React from "react";
import { createBrowserRouter } from "react-router-dom";
import RootLayout from "./components/RootLayout";
import HomePage from "./components/HomePage";
import Login from "./components/Login"; // user login
import LoginPage from "./components/LoginPage"; // admin login
import DashboardPage from "./components/DashboardPage";
import AppointmentList from "./components/AppointmentList"; // ✅ import this
import ProtectedRoute from "./components/ProtectedRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        ),
      },
      {
        path: "home",
        element: (
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        ),
      },
      {
        path: "login",
        element: <Login />, // ✅ user login page
      },
      {
        path: "admin",
        element: <LoginPage />, // ✅ admin login page
      },
      {
        path: "dashboard",
        element: (
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "appointments", // ✅ admin’s appointment view
        element: (
          <ProtectedRoute>
            <AppointmentList />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

export default router;
