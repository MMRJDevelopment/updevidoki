// components/AuthPageHelper.tsx
"use client";

import { useEffect } from "react";
import { clearAuthDialogState } from "../redux/api/baseApi"; // Adjust path as needed
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";
import { logout } from "../redux/features/auth/authSlice"; // Adjust path as needed

interface AuthPageHelperProps {
  clearTokensOnMount?: boolean;
}

/**
 * AuthPageHelper Component
 * Use this component in your login/register pages to:
 * 1. Clear any pending auth dialogs
 * 2. Optionally clear auth tokens from store
 * 3. Prevent auth-related SweetAlert popups
 */
const AuthPageHelper: React.FC<AuthPageHelperProps> = ({
  clearTokensOnMount = true,
}) => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Clear any pending auth dialog state
    clearAuthDialogState();

    // Optionally clear tokens from Redux store
    if (clearTokensOnMount) {
      dispatch(logout());
    }

    // Clear any existing SweetAlert instances
    if (Swal.isVisible()) {
      Swal.close();
    }

    console.log("AuthPageHelper: Cleared auth state for login page");
  }, [dispatch, clearTokensOnMount]);

  return null; // This component doesn't render anything
};

export default AuthPageHelper;
