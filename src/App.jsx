import React from "react";
import {
  BrowserRouter,
  Route,
  Routes,
  useNavigate,
  useLocation,
} from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import UserHome from "./pages/Dashboard";
import Header from "./Components/Header";
import Resources from "./pages/Resources";
import Support from "./pages/Support";
import Footer from "./Components/Footer";
import CheckingAccounts from "./pages/CheckingAccounts";
import SavingAccounts from "./pages/SavingAccounts";
import CreditCard from "./pages/CreditCard";
import AboutUs from "./pages/AboutUs";
import FinancialWellness from "./pages/FinancialWellness";
import Career from "./pages/Career";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Security from "./pages/Security";
import ForgotPassword from "./pages/ForgotPassword";
import Header2 from "./Components/Header2";
import Account from "./pages/Account";
import Transactions from "./pages/Transactions";
import Payment from "./pages/Payment";
import Cards from "./pages/Cards";
import Settings from "./pages/Settings";
import CheckingDetails from "./pages/CheckingDetails";
import SavingDetails from "./pages/SavingDetails";
import CreditDetails from "./pages/CreditDetails";
import ProtectedRoute from "./Components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import ChatWidget from "./Components/ChatWidget";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminChat from "./pages/AdminChat";
import AdminProtectedRoute from "./Components/AdminProtectedRoute";
import Notifications from "./pages/Notifications";

function AppContent() {
  const location = useLocation();
  // normalize pathname for reliable comparisons (strip trailing slash & lowercase)
  const pathname = location.pathname.replace(/\/$/, "").toLowerCase();
  // make sure root path becomes '/' not empty string so comparisons work
  const normalizedPath = pathname === "" ? "/" : pathname;

  const hideHeaderOnPages = [
    "/signup",
    "/login",
    "/user-home",
    "/forgot-password",
    "/account",
    "/transaction",
    "/payment",
    "/card",
    "/setting",
    "/credit-details",
    "/saving-details",
    "/checking-details",
    "/notifications",
    "/admin/login",
    "/admin/dashboard",
    "/admin/chat",
  ];
  const shouldShowHeader = !hideHeaderOnPages.includes(normalizedPath);

  const hideFooterOnPages = [
    "/signup",
    "/login",
    "/user-home",
    "/forgot-password",
    "/account",
    "/transaction",
    "/payment",
    "/card",
    "/setting",
    "/credit-details",
    "/saving-details",
    "/checking-details",
    "/notifications",
    "/admin/login",
    "/admin/dashboard",
    "/admin/chat",
  ];
  const shouldShowFooter = !hideFooterOnPages.includes(normalizedPath);

  const hideHeader2OnPages = [
    "/signup",
    "/login",
    "/forgot-password",
    "/resources",
    "/support",
    "/checking-account",
    "/saving-account",
    "/credit-card",
    "/about-us",
    "/financial-wellness",
    "/career",
    "/privacy",
    "/terms",
    "/security",
    "/",
    "/admin/login",
    "/admin/dashboard",
    "/admin/chat",
  ];
  const shouldShowHeader2 = !hideHeader2OnPages.includes(normalizedPath);

  return (
    <div>
      {shouldShowHeader && <Header />}
      {shouldShowHeader2 && <Header2 />}
      <Routes>
        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin/dashboard"
          element={
            <AdminProtectedRoute>
              <AdminDashboard />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/admin/chat"
          element={
            <AdminProtectedRoute>
              <AdminChat />
            </AdminProtectedRoute>
          }
        />

        {/* User Routes */}
        <Route
          path="/transaction"
          element={
            <ProtectedRoute>
              <Transactions />
            </ProtectedRoute>
          }
        />
        <Route
          path="/payment"
          element={
            <ProtectedRoute>
              <Payment />
            </ProtectedRoute>
          }
        />
        <Route
          path="/card"
          element={
            <ProtectedRoute>
              <Cards />
            </ProtectedRoute>
          }
        />
        <Route
          path="/setting"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <Notifications />
            </ProtectedRoute>
          }
        />
        <Route
          path="/account"
          element={
            <ProtectedRoute>
              <Account />
            </ProtectedRoute>
          }
        />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<Home />} />
        <Route
          path="/user-home"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/resources" element={<Resources />} />
        <Route path="/support" element={<Support />} />
        <Route path="/checking-account" element={<CheckingAccounts />} />
        <Route path="/saving-account" element={<SavingAccounts />} />
        <Route path="/credit-card" element={<CreditCard />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/financial-wellness" element={<FinancialWellness />} />
        <Route path="/career" element={<Career />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/security" element={<Security />} />
        <Route
          path="/checking-details"
          element={
            <ProtectedRoute>
              <CheckingDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/saving-details"
          element={
            <ProtectedRoute>
              <SavingDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/credit-details"
          element={
            <ProtectedRoute>
              <CreditDetails />
            </ProtectedRoute>
          }
        />
      </Routes>
      {shouldShowFooter && <Footer />}
      {!normalizedPath.startsWith("/admin") && <ChatWidget />}
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
