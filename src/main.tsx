// src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";

import { AuthProvider } from "./contexts/AuthContext";
import RootLayout from "./components/RootLayout";
import App from "./App";
import Login from "./components/Login"; // user login
import LoginPage from "./components/LoginPage"; // admin login
import DashboardPage from "./components/DashboardPage";
import ProtectedRoute from "./components/ProtectedRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <App />, // Home page
      },
      {
        path: "home",
        element: <App />, // ✅ Allow "/home" to render App as well
      },
      {
        path: "login",
        element: <Login />, // User login
      },
      {
        path: "admin",
        element: <LoginPage />, // Admin login
      },
      {
        path: "dashboard",
        element: (
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);
