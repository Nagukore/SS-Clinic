// src/main.tsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';

// Layout & pages
import RootLayout from './components/RootLayout';
import App from './App'; // Home page (Hero + Latest Blogs)
import About from './components/About';
import Doctors from './components/Doctors';
import Services from './components/Services';
import Contact from './components/Contact';
import LoginPage from './components/LoginPage';
import DashboardPage from './components/DashboardPage';
import ProtectedRoute from './components/ProtectedRoute';
import BlogListPage from './components/BlogListPage';
import BlogPostPage from './components/BlogPostPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <App />,
      },
      {
        path: 'about',
        element: <About />,
      },
      {
        path: 'doctors',
        element: <Doctors />,
      },
      {
        path: 'services',
        element: <Services />,
      },
      {
        path: 'contact',
        element: <Contact />,
      },
      {
        path: 'admin',
        element: <LoginPage />,
      },
      {
        path: 'dashboard',
        element: (
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'blogs',
        element: <BlogListPage />,
      },
      {
        path: 'blogs/:slug',
        element: <BlogPostPage />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
