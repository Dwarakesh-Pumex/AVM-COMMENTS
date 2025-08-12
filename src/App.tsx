import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { useEffect } from "react";
import Login from "./pages/authentication/Login/Login";
import Profile from "./pages/authentication/Profile/Profile";
import Cookies from "js-cookie";
import ResetPassword from "./pages/authentication/ResetPassword/ResetPassword";
import ForgotPassword from "./pages/authentication/ForgotPassword/ForgotPassword";
import ChangePassword from "./pages/authentication/ChangePassword/ChangePassword";
import CommentManagment from "./pages/commentManagement/commentManagement";
import DefaultPage from "./pages/default/defaultPage";
import AdminDashboard from "./pages/adminDashboard/adminDashboard";

function App() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const role = Cookies.get("role");
    const protectedRoutes = [
      "/admin-dashboard",
      "/supervisor-dashboard",
      "/staff-dashboard",
      "/customer-dashboard",
      "/customer-incidents",
      "/customer-playbacks",
      "./change-password",
      "./logout",
      "./profile",
    ];

    const publicRoutes = [
      "/login",
      "/forgot-password",
      "/reset-password",
      "./default-page",
    ];

    if (role) {
      if (publicRoutes.includes(location.pathname)) {
        switch (role.toLowerCase()) {
          case "role_admin":
            navigate("/admin-dashboard");
            break;
          case "role_supervisor":
            navigate("/supervisor-dashboard");
            break;
          case "role_staff":
            navigate("/staff-dashboard");
            break;
          case "role_customer":
            navigate("/customer-dashboard");
            break;
          default:
            navigate("/login");
        }
      } else if (protectedRoutes.includes(location.pathname)) {
        if (
          (role.toLowerCase() === "role_customer" &&
            !["/customer-dashboard"].includes(location.pathname)) ||
          (role.toLowerCase() === "role_admin" &&
            location.pathname !== "/admin-dashboard") ||
          (role.toLowerCase() === "role_supervisor" &&
            location.pathname !== "/supervisor-dashboard") ||
          (role.toLowerCase() === "role_staff" &&
            location.pathname !== "/staff-dashboard")
        ) {
          switch (role.toLowerCase()) {
            case "role_admin":
              navigate("/admin-dashboard");
              break;
            case "role_supervisor":
              navigate("/supervisor-dashboard");
              break;
            case "role_staff":
              navigate("/staff-dashboard");
              break;
            case "role_customer":
              navigate("/customer-dashboard");
              break;
          }
        }
      }
    } else if (!publicRoutes.includes(location.pathname)) {
      navigate("/login");
    }
  }, [navigate, location.pathname]);

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/change-password" element={<ChangePassword />} />
      <Route path="/comment-page" element={<CommentManagment />} />
      <Route path = "/default-page" element={<DefaultPage />} />
      <Route path = "/admin-dashboard" element={<AdminDashboard />} />
    </Routes>
  );
}

export default App;
