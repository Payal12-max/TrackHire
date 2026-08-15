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
import ApplicationNew from "./pages/ApplicationNew"; // ✅ ADD THIS
import Calendar from "./pages/Calendar";
import Interviews from "./pages/Interviews";
import Companies from "./pages/Companies";
import Dashboard from "./pages/Dashboard";
import ApplicationDetails from "./pages/ApplicationDetails";
import ReminderNew from "./pages/ReminderNew";

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
          // Dashboard home
          {
            index: true,
            element: <Dashboard />,
          },

          // Kanban tracker
          {
            path: "kanban",
            element: <Kanban />,
          },

          // All applications
          {
            path: "applications",
            element: <Applications />,
          },

          // Add new application
          {
            path: "applications/new",
            element: <ApplicationNew />,
          },

          // Application details
          {
            path: "applications/:id",
            element: <ApplicationDetails />,
          },

          // Calendar
          {
            path: "calendar",
            element: <Calendar />,
          },

          {
            path: "reminders/new",
            element: <ReminderNew />,
          },

          // Interviews
          {
            path: "interviews",
            element: <Interviews />,
          },

          // Companies
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
