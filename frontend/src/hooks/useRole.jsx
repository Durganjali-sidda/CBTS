// src/hooks/useRole.js
import { useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

/**
 * useRole(requiredRole)
 *
 * - If there is no logged‑in user, redirects to /login.
 * - If the logged‑in user’s role doesn’t match `requiredRole`, redirects to /app/bugs.
 */
export default function useRole(requiredRole) {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    // 1) If not logged in at all, send to login
    if (!user) {
      navigate("/login", { replace: true });
      return;
    }

    // 2) If logged in but wrong role, send to generic bug list
    if (user.role !== requiredRole) {
      navigate("/app/bugs", { replace: true });
    }
    // If role matches, do nothing and let the page render
  }, [user, requiredRole, navigate]);
}
