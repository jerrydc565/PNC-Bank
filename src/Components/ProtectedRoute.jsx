import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const email = localStorage.getItem("email");

  // If no email, redirect to login
  if (!email) {
    return <Navigate to="/login" replace />;
  }

  // If logged in, show the page
  return children;
}

export default ProtectedRoute;
