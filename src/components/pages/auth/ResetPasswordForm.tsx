"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/buttons/Button";
import { useResetPasswordMutation } from "@/redux/features/auth/authApi";
import { toast } from "sonner";
import { useAppSelector } from "@/redux/hooks";

// ✅ Schema (email + password only)
const resetPasswordSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type ResetPasswordForm = z.infer<typeof resetPasswordSchema>;

export function ResetPasswordForm() {
  const router = useRouter();
  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const accessToken = useAppSelector((state) => state.auth.access_token);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordForm>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordForm) => {
    try {
      const result = await resetPassword({
        email: data.email,
        password: data.password,
        token: accessToken || "",
      }).unwrap();

      if (result.success) {
        toast.success(result.message);
        router.push("/auth/login");
      } else {
        toast.error(result.message);
      }
    } catch {
      toast.error("Failed to reset password. Please try again.");
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">
            Reset your password
          </h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Email */}
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="text-sm font-medium text-gray-700 mb-2"
            >
              Email
            </label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your Email"
              {...register("email")}
              className={errors.email ? "border-red-500" : ""}
            />
            {errors.email && (
              <p className="text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label
              htmlFor="password"
              className="text-sm font-medium text-gray-700 mb-2"
            >
              New Password
            </label>
            <Input
              id="password"
              type="password"
              placeholder="Enter new Password"
              {...register("password")}
              className={errors.password ? "border-red-500" : ""}
            />
            {errors.password && (
              <p className="text-sm text-red-600">{errors.password.message}</p>
            )}
            <p className="text-sm text-gray-500">
              Must be at least 8 characters
            </p>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors"
            disabled={isLoading}
          >
            {isLoading ? "Changing password..." : "Change password"}
          </Button>
        </form>

        <div className="mt-8 text-center">
          <Link
            href="/auth/login"
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-800 transition-colors"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
}
