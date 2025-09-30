/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../store";

type TAuthState = {
  user: null | any;
  access_token: null | string;
  refresh_token: null | string;
  otp: null | any;
};

const initialState: TAuthState = {
  user:
    typeof window !== "undefined"
      ? (() => {
          const storedUser = localStorage.getItem("user");
          if (!storedUser || storedUser === "undefined") return null;
          try {
            return JSON.parse(storedUser);
          } catch {
            return null;
          }
        })()
      : null,
  access_token:
    typeof window !== "undefined" ? localStorage.getItem("access_token") : null,
  refresh_token:
    typeof window !== "undefined"
      ? localStorage.getItem("refresh_token")
      : null,
  otp:
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("otp") || "null")
      : null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (
      state,
      action: PayloadAction<{
        user?: any;
        access_token?: string | null;
        refresh_token?: string | null;
        otp?: any;
      }>
    ) => {
      const { user, access_token, refresh_token, otp } = action.payload;
      state.user = user;
      state.access_token = access_token ?? null;
      state.refresh_token = refresh_token ?? null;
      state.otp = otp;

      if (typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify(user));
        if (access_token) localStorage.setItem("access_token", access_token);
        if (refresh_token) localStorage.setItem("refresh_token", refresh_token);
        if (otp) localStorage.setItem("otp", JSON.stringify(otp));
      }
    },

    clearOtp: (state) => {
      state.otp = null;
      if (typeof window !== "undefined") {
        localStorage.removeItem("otp");
      }
    },

    updateAccessToken: (
      state,
      action: PayloadAction<{ access_token: string }>
    ) => {
      state.access_token = action.payload.access_token;
      if (typeof window !== "undefined") {
        localStorage.setItem("access_token", action.payload.access_token);
      }
    },

    logout: (state) => {
      state.user = null;
      state.access_token = null;
      state.refresh_token = null;
      state.otp = null;

      if (typeof window !== "undefined") {
        localStorage.removeItem("user");
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("otp");
      }
    },
  },
});

export const { setUser, updateAccessToken, clearOtp, logout } =
  authSlice.actions;
export default authSlice.reducer;

// ✅ Selectors
export const useCurrentToken = (state: RootState) => state.auth.access_token;
export const selectCurrentUser = (state: RootState) => state.auth.user;
export const selectOtp = (state: RootState) => state.auth.otp;
export const selectIsAuthenticated = (state: RootState) =>
  Boolean(state.auth.access_token && state.auth.user);
