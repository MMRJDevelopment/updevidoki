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
import { useLoginMutation } from "@/redux/features/auth/authApi";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/features/auth/authSlice";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { jwtDecode } from "jwt-decode";

export interface DecodedToken {
  id: string;
  email: string;
  role: string;
  exp: number;
  iat: number;
}

export const decodeToken = (token: string): DecodedToken | null => {
  try {
    return jwtDecode<DecodedToken>(token);
  } catch (err) {
    console.error("Failed to decode token", err);
    return null;
  }
};

const clearAuthDialogState = (): void => {
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
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const result = await login(data).unwrap();

      if (result.success) {
        const tokens = {
          access_token: result.data.accessToken,
          refresh_token: result.data.refreshToken,
        };

        // Decode access token
        const decoded = decodeToken(tokens.access_token);
        console.log("Decoded token:", decoded);

        if (!decoded) {
          toast.error("Failed to decode token");
          return;
        }

        // FIXED: Dispatch user data to Redux FIRST
        dispatch(
          setUser({
            access_token: tokens.access_token,
            refresh_token: tokens.refresh_token,
            user: decoded,
            otp: null,
          })
        );


        // Show success message
        toast.success("Login successful!");

        // Clear auth dialog state
        clearAuthDialogState();

        // THEN navigate based on role
        // Use setTimeout to ensure Redux state is fully updated
        setTimeout(() => {
          if (decoded.role === "USER") {
            router.push("/dashboard");
          } else if (decoded.role === "SUPER_ADMIN") {
            router.push("/dashboard/admin");
          } else {
            router.push("/");
          }
        }, 100);
      }
    } catch (error: any) {
      const errorMessage =
        error?.data?.message || "Login failed. Please try again.";
      toast.error(errorMessage);
    }
  };

  const handleForgotPassword = () => {
    toast("Password reset functionality coming soon!", {
      icon: "🔐",
    });
  };

  const handleSignUp = () => {
    clearAuthDialogState();
    router.push("/auth/register");
  };

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
              disabled={isLoginLoading}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2 relative">
            <Label
              htmlFor="password"
              className="text-sm font-medium text-gray-700"
            >
              Password
            </Label>

            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your Password"
                className="h-12 w-full rounded-xl border-gray-200 bg-gray-50 px-4 pr-12 text-gray-900 placeholder:text-gray-500 focus:border-blue-500/50 focus:bg-white focus:ring-blue-500/20"
                {...register("password")}
                disabled={isLoginLoading}
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

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
                disabled={isLoginLoading}
              >
                Reset Password?
              </button>
            </Link>
          </div>

          <Button
            type="submit"
            disabled={isLoginLoading}
            className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoginLoading ? "Logging in..." : "Log In"}
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
                disabled={isLoginLoading}
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
