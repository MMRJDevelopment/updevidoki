/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/buttons/Button";
import { toast } from "sonner";
import { useGetMeQuery, useLoginMutation } from "@/redux/features/auth/authApi";
import { useDispatch } from "react-redux";
import { setUser, logout } from "@/redux/features/auth/authSlice";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
// import { useAppSelector } from "@/redux/hooks";

// Auth page helper functions integrated directly
const clearAuthDialogState = (): void => {
  // Clear any pending auth dialog state
  if (typeof window !== "undefined") {
    (window as any).__isAuthDialogShowing = false;
  }
};

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm() {
  const [login, { isLoading: isLoginLoading }] = useLoginMutation();
  const dispatch = useDispatch();
  const router = useRouter();
  const [shouldFetchUser, setShouldFetchUser] = useState(false);
  const [loginTokens, setLoginTokens] = useState<{
    access_token: string;
    refresh_token: string;
  } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  // Get Me Query - only trigger when shouldFetchUser is true
  const {
    data: userData,
    isLoading: isUserDataLoading,
    isSuccess: isUserDataSuccess,
    isError: isUserDataError,
    error: userDataError,
  } = useGetMeQuery(
    {}, // Empty object as parameter
    {
      skip: !shouldFetchUser, // Skip this query until shouldFetchUser is true
    }
  );

  // Auth page helper effect - prevents SweetAlert on login page
  useEffect(() => {
    // Clear any pending auth dialog state
    clearAuthDialogState();

    // Clear tokens from Redux store to prevent conflicts
    dispatch(logout());

    // Clear any existing SweetAlert instances
    const clearExistingSweetAlerts = async () => {
      try {
        const { default: Swal } = await import("sweetalert2");
        if (Swal.isVisible()) {
          Swal.close();
        }
      } catch {
        console.log("SweetAlert not available or already cleared");
      }
    };

    clearExistingSweetAlerts();

    console.log("LoginForm: Cleared auth state for login page");
  }, [dispatch]);

  // Handle Get Me API response after login
  useEffect(() => {
    if (shouldFetchUser && loginTokens) {
      if (isUserDataSuccess && userData) {
        // Set complete user data in Redux
        dispatch(
          setUser({
            access_token: loginTokens.access_token,
            refresh_token: loginTokens.refresh_token,
            user: userData.data || userData, // Handle different response structures
            otp: null,
          })
        );


        // Clear auth dialog state before redirect
        clearAuthDialogState();

        // Reset states
        setShouldFetchUser(false);
        setLoginTokens(null);

        // Redirect to dashboard
        router.push("/dashboard");
      } else if (isUserDataError) {
        console.error("Get Me API Error:", userDataError);

        // Handle Get Me API error
        const errorMessage =
          (userDataError as any)?.data?.message || "Failed to fetch user data";
        toast.error(errorMessage);

        // Reset states
        setShouldFetchUser(false);
        setLoginTokens(null);

        // Clear tokens from Redux as user data fetch failed
        dispatch(logout());
      }
    }
  }, [
    shouldFetchUser,
    loginTokens,
    isUserDataSuccess,
    isUserDataError,
    userData,
    userDataError,
    dispatch,
    router,
  ]);

  const onSubmit = async (data: LoginFormData) => {
    try {
      const result = await login(data).unwrap();

      if (result.success) {
        toast.success("Login successful! Fetching user data...");

        // Store tokens temporarily and set user data to Redux for API calls
        const tokens = {
          access_token: result.data.accessToken,
          refresh_token: result.data.refreshToken,
        };

        setLoginTokens(tokens);

        // Set tokens in Redux first so that Get Me API can use them
        dispatch(
          setUser({
            access_token: tokens.access_token,
            refresh_token: tokens.refresh_token,
            user: null, // Will be set after Get Me API call
            otp: null,
          })
        );

        // Trigger Get Me API call
        setShouldFetchUser(true);

        console.log("Login successful, tokens set, triggering Get Me API...");
      }
    } catch (error: any) {
      const errorMessage =
        error?.data?.message || "Login failed. Please try again.";
      toast.error(errorMessage);

      // Reset states on login error
      setShouldFetchUser(false);
      setLoginTokens(null);
    }
  };

  const handleForgotPassword = () => {
    toast("Password reset functionality coming soon!", {
      icon: "🔐",
    });
  };

  const handleSignUp = () => {
    // Clear auth state before navigation
    clearAuthDialogState();
    router.push("/auth/register");
  };

  // Combined loading state
  const isProcessing = isLoginLoading || (shouldFetchUser && isUserDataLoading);

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">Log In</h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label
              htmlFor="email"
              className="text-sm font-medium text-gray-700"
            >
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your Email"
              className="h-12 rounded-xl border-gray-200 bg-gray-50 px-4 text-gray-900 placeholder:text-gray-500 focus:border-blue-500/50 focus:bg-white focus:ring-blue-500/20"
              {...register("email")}
              disabled={isProcessing}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="password"
              className="text-sm font-medium text-gray-700"
            >
              Password
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your Password"
              className="h-12 rounded-xl border-gray-200 bg-gray-50 px-4 text-gray-900 placeholder:text-gray-500 focus:border-blue-500/50 focus:bg-white focus:ring-blue-500/20"
              {...register("password")}
              disabled={isProcessing}
            />
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>

          <div className="text-right">
            <Link href="/auth/reset-password">
              <button
                type="button"
                className="text-sm text-blue-600 hover:text-blue-700 font-medium disabled:opacity-50"
                onClick={handleForgotPassword}
                disabled={isProcessing}
              >
                Reset Password?
              </button>
            </Link>
          </div>

          <Button
            type="submit"
            disabled={isProcessing}
            className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoginLoading && "Logging in..."}
            {shouldFetchUser && isUserDataLoading && "Fetching user data..."}
            {!isProcessing && "Log In"}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            I don&#39;t have an account?{" "}
            <Link href="/auth/register">
              <button
                type="button"
                className="text-blue-600 hover:text-blue-700 font-medium disabled:opacity-50"
                onClick={handleSignUp}
                disabled={isProcessing}
              >
                Sign Up
              </button>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
