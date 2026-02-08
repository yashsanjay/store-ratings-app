import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

const navLinkStyle = ({ isActive }) => ({
  color: isActive ? "#2563eb" : "#111",
  fontWeight: isActive ? 600 : 400,
  textDecoration: "none"
});

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div className="nav">
      <div className="nav-inner">
        {/* Logo / Home */}
        <NavLink to="/stores" style={{ fontWeight: 700, color: "#111" }}>
          StoreRatings
        </NavLink>

        {/* Navigation Links */}
        <div className="nav-links">
          {user && <span className="badge">{user.role}</span>}

          <NavLink to="/stores" style={navLinkStyle}>
            Stores
          </NavLink>

          {user?.role === "SYSTEM_ADMIN" && (
            <NavLink to="/admin" style={navLinkStyle}>
              Admin
            </NavLink>
          )}

          {user?.role === "STORE_OWNER" && (
            <NavLink to="/owner" style={navLinkStyle}>
              Owner
            </NavLink>
          )}

          {user && (
            <NavLink to="/profile" style={navLinkStyle}>
              Profile
            </NavLink>
          )}

          {!user ? (
            <>
              <NavLink to="/login" style={navLinkStyle}>
                Login
              </NavLink>
              <NavLink to="/signup" style={navLinkStyle}>
                Signup
              </NavLink>
            </>
          ) : (
            <button
              className="secondary"
              style={{ width: "auto" }}
              onClick={handleLogout}
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
