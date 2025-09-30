/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import type React from "react";

import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/buttons/Button";
import { toast } from "sonner";
import {
  useOtpMutation,
  useResendOtpMutation,
} from "@/redux/features/auth/authApi";
import { RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "@/redux/features/auth/authSlice";

const verificationSchema = z.object({
  code: z
    .string()
    .length(6, "Code must be 6 digits")
    .regex(/^\d+$/, "Code must contain only numbers"),
});

type VerificationForm = z.infer<typeof verificationSchema>;

export default function EmailVerificationForm() {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(59);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();
  const dispatch = useDispatch();
  const [verifyCode, { isLoading: isVerifying }] = useOtpMutation();
  const [resendCode, { isLoading: isResending }] = useResendOtpMutation();
  const user = useSelector((state: RootState) => state.auth.user);
  const email = user?.email;

  const {
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<VerificationForm>({
    resolver: zodResolver(verificationSchema),
  });

  // Countdown timer
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [timeLeft]);

  // Format time display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // Handle code input
  const handleCodeChange = (index: number, value: string) => {
    if (value.length > 1) return; // Prevent multiple characters

    const newCode = [...code];
    newCode[index] = value;

    setCode(newCode);
    setValue("code", newCode.join(""));

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle backspace
  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Handle paste
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;

    const newCode = pastedData
      .split("")
      .concat(Array(6 - pastedData.length).fill(""))
      .slice(0, 6);
    setCode(newCode);
    setValue("code", newCode.join(""));

    // Focus the next empty input or the last one
    const nextIndex = Math.min(pastedData.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };

  const onSubmit = async (data: VerificationForm) => {
    try {
      const result = await verifyCode({
        email,
        code: data.code,
        purpose: "EMAIL_VERIFICATION",
      }).unwrap();

      toast.success(result.message);
      console.log(result, "verification result");

      if (result.success) {
        // Save tokens in Redux & localStorage
        dispatch(
          setUser({
            user: { email, isVerified: result.data.isVerified }, // minimal user update
            access_token: result.data.accessToken,
            refresh_token: result.data.refreshToken,
            otp: null, // or set to the appropriate value if available
          })
        );
        router.push("/auth/login");
      }
    } catch (error: any) {
      toast.error(error.data?.message || "Verification failed");
    }
  };

  const handleResend = async () => {
    if (!canResend) return;

    try {
      const result = await resendCode({
        email,
        code,
        purpose: "verify",
      }).unwrap();
      toast.success(result.message);
      setTimeLeft(59);
      setCanResend(false);
      setCode(["", "", "", "", "", ""]);
      setValue("code", "");
      inputRefs.current[0]?.focus();
    } catch (error: any) {
      toast.error(error.data?.message || "Failed to resend code");
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">
            Check your email
          </h1>
          <p className="text-gray-600 text-sm leading-relaxed">
            Please enter your 6 digit code, Then create and confirm your new
            password
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Code Input Fields */}
          <div className="space-y-4">
            <div className="flex justify-center gap-3">
              {code.map((digit, index) => (
                <Input
                  key={index}
                  ref={(el) => {
                    inputRefs.current[index] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleCodeChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  className="w-12 h-12 text-center text-lg font-semibold rounded-full border-2 focus:border-blue-500 focus:ring-blue-500/20"
                  aria-label={`Digit ${index + 1}`}
                />
              ))}
            </div>
            {errors.code && (
              <p className="text-red-500 text-sm text-center">
                {errors.code.message}
              </p>
            )}
          </div>

          {/* Timer and Resend */}
          <div className="text-center space-y-2">
            <p className="text-blue-600 text-sm font-medium">
              Code expires in: {formatTime(timeLeft)}
            </p>
            <p className="text-gray-600 text-sm">
              Didn&apos;t get a code?{" "}
              <button
                type="button"
                onClick={handleResend}
                disabled={!canResend || isResending}
                className={`font-medium ${
                  canResend
                    ? "text-blue-600 hover:text-blue-700 cursor-pointer"
                    : "text-gray-400 cursor-not-allowed"
                }`}
              >
                {isResending ? "Sending..." : "Click to resend."}
                Click to resend.
              </button>
            </p>
          </div>

          {/* Submit Button */}
          {/* <Link href="/auth/reset-password">
            <Button
              type="submit"
              disabled={isVerifying || code.join("").length !== 6}
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isVerifying ? "Verifying..." : "Submit"}
            </Button>
          </Link> */}
          <Button
            type="submit"
            disabled={isVerifying || code.join("").length !== 6}
            className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isVerifying ? "Verifying..." : "Submit"}
          </Button>
        </form>
      </div>
    </div>
  );
}
