import React from "react";
import ReactDOM from "react-dom/client";
import App from "@/App";
import CallBack from "@/pages/CallBack.jsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ErrorPage from "@/pages/ErrorPage";
import Dashboard from "@/pages/Dashboard";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        errorElement: <ErrorPage />,
    },
    {
        path: "/dashboard",
        element: <Dashboard />,
    },
    {
        path: "/google/callback",
        element: <CallBack />,
    },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
    <RouterProvider router={router} />,
);
