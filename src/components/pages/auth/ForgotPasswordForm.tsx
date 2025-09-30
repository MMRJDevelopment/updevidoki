/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import Link from "next/link";
import { Button } from "@/components/ui/buttons/Button";
import { useForgotPasswordMutation } from "@/redux/features/auth/authApi";

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export function ForgotPasswordForm() {
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      const result = await forgotPassword(data).unwrap();
      console.log(result, "result");

      if (result.success) {
        toast.success("Password reset link sent to your email!");
        console.log("Forgot password successful:", result);
      }
    } catch (error: any) {
      const errorMessage =
        error?.data?.message || "Failed to send reset link. Please try again.";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">
            Forgot Password!
          </h1>
          <p className="text-sm text-gray-600 mt-2">
            Enter your Registered Email Below
          </p>
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
              placeholder="david@gmail.com"
              className="h-12 rounded-xl border-gray-200 bg-gray-50 px-4 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:bg-white focus:ring-blue-500"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          {/* <Link href="/auth/verify-email"> */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors"
            >
              {isLoading ? "Sending..." : "Continue"}
              Continue
            </Button>
     
        </form>

        <div className="mt-6 text-center">
          <Link
            href="/auth/login"
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
