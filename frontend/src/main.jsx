import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { ClerkProvider } from "@clerk/clerk-react";

import App from "./App";
import Landing from "./landing/index.jsx";
import Home from "./pages/Home";
import DashboardLayout from "./layouts/dashboardlayout";
import Overview from "./pages/Overview";
import Kanban from "./pages/Kanban";
import Applications from "./pages/Applications";
import Calendar from "./pages/Calendar";
import Interviews from "./pages/Interviews";
import Companies from "./pages/Companies";
import Dashboard from "./pages/Dashboard";

import { AppProvider } from "./context/AppContext.jsx";

import "./index.css";

const clerkKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      // Landing page
      {
        index: true,
        element: <Landing />,
      },

      // Sign in / Sign up
      {
        path: "auth",
        element: <Home />,
      },

      // Dashboard
      {
        path: "dashboard",
        element: <DashboardLayout />,
        children: [
          {
            index: true,
            element: <Dashboard />,
          },
          {
            path: "kanban",
            element: <Kanban />,
          },
          {
            path: "applications",
            element: <Applications />,
          },
          {
            path: "calendar",
            element: <Calendar />,
          },
          {
            path: "interviews",
            element: <Interviews />,
          },
          {
            path: "companies",
            element: <Companies />,
          },
        ],
      },

      // Anything unknown
      {
        path: "*",
        element: <Navigate to="/" replace />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={clerkKey}>
      <AppProvider>
        <RouterProvider router={router} />
      </AppProvider>
    </ClerkProvider>
  </React.StrictMode>,
);
