/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  createApi,
  fetchBaseQuery,
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { RootState } from "../store";
import { logout, setUser } from "../features/auth/authSlice";
import Swal from "sweetalert2";
import { signOut } from "next-auth/react";

// Type for refresh token response
interface RefreshTokenResponse {
  success: boolean;
  data: {
    token: string;
    refresh_token?: string;
  };
  message?: string;
}

// Track if we're already showing an auth dialog to prevent duplicates
let isAuthDialogShowing = false;

// Helper function to check if current page is login/auth related
const isAuthPage = (): boolean => {
  if (typeof window === "undefined") return false;

  const authPages = ["/login", "/register", "/auth", "/signin", "/signup"];
  const currentPath = window.location.pathname.toLowerCase();

  return authPages.some((page) => currentPath.includes(page));
};

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const access_token = (getState() as RootState).auth.access_token;
    headers.set("accept", "application/json");
    headers.set("Content-Type", "application/json");

    if (access_token) {
      headers.set("authorization", `Bearer ${access_token}`);
    }
    return headers;
  },
});

const baseQueryWithRefreshToken: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  // Handle 401 unauthorized errors
  if (result.error?.status === 401) {
    try {
      const state = api.getState() as RootState;
      const refreshToken = state.auth.refresh_token;

      // Skip auth logic if we're on login page
      if (isAuthPage()) {
        console.log("Skipping auth refresh on login page");
        return result;
      }

      // Check if refresh token exists
      if (!refreshToken) {
        await handleLogout(api, "No refresh token available", false);
        return result;
      }

      // Attempt to refresh the access token
      const refreshResult = await refreshAccessToken(refreshToken);

      if (refreshResult.success) {
        const user = state.auth.user;

        // Update the store with new tokens
        api.dispatch(
          setUser({
            user,
            access_token: refreshResult.data.token,
            refresh_token: refreshResult.data.refresh_token || refreshToken,
            otp: null,
          })
        );

        // Retry the original query with the new token
        result = await baseQuery(args, api, extraOptions);
      } else {
        await handleLogout(
          api,
          refreshResult.message || "Token refresh failed",
          true
        );
      }
    } catch (error) {
      console.error("Error during token refresh:", error);
      if (!isAuthPage()) {
        await handleLogout(
          api,
          "An error occurred during authentication",
          true
        );
      }
    }
  }

  return result;
};

// Separate function to handle token refresh
const refreshAccessToken = async (
  refreshToken: string
): Promise<RefreshTokenResponse> => {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    if (!baseUrl) {
      throw new Error("Base URL is not configured");
    }

    // Ensure proper URL formatting
    const refreshUrl = baseUrl.endsWith("/")
      ? `${baseUrl}refresh-token`
      : `${baseUrl}/refresh-token`;

    const response = await fetch(refreshUrl, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${refreshToken}`,
      },
    });

    if (!response.ok) {
      // Handle different HTTP status codes
      if (response.status === 404) {
        throw new Error(
          "Refresh token endpoint not found. Please check your API configuration."
        );
      } else if (response.status === 403) {
        throw new Error("Refresh token is invalid or expired.");
      } else {
        throw new Error(
          `Authentication failed with status: ${response.status}`
        );
      }
    }

    const data: RefreshTokenResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Token refresh request failed:", error);
    return {
      success: false,
      data: { token: "" },
      message:
        error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
};

// Separate function to handle logout with better UX
const handleLogout = async (
  api: any,
  message: string,
  showDialog: boolean = true
): Promise<void> => {
  try {
    // Always logout from store first
    api.dispatch(logout());

    // Sign out from NextAuth session silently
    await signOut({ redirect: false });

    // Skip dialog if we're on auth page or already showing one
    if (!showDialog || isAuthPage() || isAuthDialogShowing) {
      console.log("Skipping logout dialog - on auth page or already showing");
      return;
    }

    // Prevent multiple dialogs
    isAuthDialogShowing = true;

    const result = await Swal.fire({
      icon: "warning",
      title: "Session Expired",
      text: message + ". Please login again to continue.",
      showConfirmButton: true,
      confirmButtonText: "Go to Login",
      showCancelButton: true,
      cancelButtonText: "Stay Here",
      allowOutsideClick: false,
      allowEscapeKey: false,
    });

    // Reset dialog flag
    isAuthDialogShowing = false;

    // Redirect to login page if user confirms
    if (result.isConfirmed) {
      window.location.href = "/login"; // Adjust path as needed
    }
  } catch (error) {
    console.error("Error during logout:", error);
    // Reset dialog flag even on error
    isAuthDialogShowing = false;

    // Fallback logout if SweetAlert fails
    api.dispatch(logout());
    await signOut({ redirect: false });
  }
};

// Function to clear auth dialog state (call this when navigating to login page)
export const clearAuthDialogState = (): void => {
  isAuthDialogShowing = false;
};

// Function to manually trigger logout (useful for logout button)
export const triggerLogout = async (dispatch: any): Promise<void> => {
  try {
    dispatch(logout());
    await signOut({ redirect: false });

    // Don't show dialog for manual logout
    window.location.href = "/login";
  } catch (error) {
    console.error("Manual logout error:", error);
    dispatch(logout());
    await signOut({ redirect: false });
  }
};

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: baseQueryWithRefreshToken,
  tagTypes: [
    "user",
    "example",
    "payments",
    "dashboard",
    "orders",
    "tickets",
    "messages",
    "memorials"
  ], // Add more tag types as needed
  endpoints: () => ({}),
  // Optional: Add default tags for better caching
  keepUnusedDataFor: 60, // Keep unused data for 60 seconds
});

// Export hooks for better type safety (optional)
export const {
  // Add your specific endpoint hooks here when you create them
  // Example: useGetUserQuery, useUpdateUserMutation, etc.
} = baseApi;
