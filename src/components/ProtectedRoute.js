// src/components/ProtectedRoute.js
import React from "react";
import { Navigate } from "react-router-dom";
import { auth } from "../firebase"; // ✅ from your firebase.js

const ADMIN_EMAILS = ["your-email@gmail.com"]; // ✅ add allowed admins here

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const user = auth.currentUser;

  if (!user) {
    // 🚫 Not logged in → go to login page
    return <Navigate to="/account" replace />;
  }

  if (adminOnly && !ADMIN_EMAILS.includes(user.email)) {
    // 🚫 Logged in but not an admin → deny access
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
