"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/buttons/Button";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useRegisterMutation } from "@/redux/features/auth/authApi";
import { useAppDispatch } from "@/redux/hooks";
import { setUser } from "@/redux/features/auth/authSlice";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const signUpSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type SignUpFormData = z.infer<typeof signUpSchema>;

export function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();
  const [signUp, { isLoading }] = useRegisterMutation();
  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  });

  const togglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const onSubmit = async (data: SignUpFormData) => {
    try {
      const result = await signUp(data).unwrap();

      if (result.success) {
        toast.success(result.message || "Account created successfully!");
        const user = result.data.user;
        const otp = result.data.otp;
        const access_token = result.data.access_token || null;
        const refresh_token = result.data.refresh_token || null;

        // Save to Redux & localStorage
        dispatch(setUser({ user, access_token, refresh_token, otp }));

        // Redirect to verify email
        router.push("/auth/verify-email");
      } else {
        toast.error(result.message || "Sign up failed");
      }
    } catch (error: unknown) {
      if (
        typeof error === "object" &&
        error !== null &&
        "data" in error &&
        typeof (error as { data?: { message?: string } }).data === "object"
      ) {
        toast.error(
          ((error as { data?: { message?: string } }).data as { message?: string })?.message ||
            "An error occurred during sign up"
        );
      } else {
        toast.error("An error occurred during sign up");
      }
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">Sign Up</h1>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* First Name */}
          <div className="space-y-2">
            <Label
              htmlFor="firstName"
              className="text-sm font-medium text-gray-700"
            >
              First Name
            </Label>
            <Input
              id="firstName"
              type="text"
              placeholder="Enter your first name"
              {...register("firstName")}
              className={errors.firstName ? "border-red-500" : ""}
            />
            {errors.firstName && (
              <p className="text-sm text-red-500">{errors.firstName.message}</p>
            )}
          </div>

          {/* Last Name */}
          <div className="space-y-2">
            <Label
              htmlFor="lastName"
              className="text-sm font-medium text-gray-700"
            >
              Last Name
            </Label>
            <Input
              id="lastName"
              type="text"
              placeholder="Enter your last name"
              {...register("lastName")}
              className={errors.lastName ? "border-red-500" : ""}
            />
            {errors.lastName && (
              <p className="text-sm text-red-500">{errors.lastName.message}</p>
            )}
          </div>

          {/* Email */}
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
              {...register("email")}
              className={errors.email ? "border-red-500" : ""}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
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
                {...register("password")}
                className={`pr-10 ${errors.password ? "border-red-500" : ""}`}
              />
              <button
                type="button"
                onClick={togglePassword}
                className="absolute inset-y-0 right-2 flex items-center text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>

          {/* Submit */}
          <Button
            type="submit"
            className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors"
            disabled={isLoading}
          >
            {isLoading ? "Creating Account..." : "Sign Up"}
          </Button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              href="/auth/login"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Log In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
