"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Edit3 } from "lucide-react";
import Image from "next/image";
import { useChangePasswordMutation } from "@/redux/features/auth/authApi";
import { toast } from "sonner";

export default function AccountSettings() {
  const [firstName, setFirstName] = useState("Jhon");
  const [lastName, setLastName] = useState("David");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [changePassword, { isLoading }] = useChangePasswordMutation();

  const handleSaveProfile = () => {
    console.log("Saving profile:", { firstName, lastName });
    // Add your save logic here
  };

  const handleUpdatePassword = async () => {
    try {
      console.log("Updating password...");
      const res = await changePassword({
        oldPassword: currentPassword,
        newPassword: newPassword,
      }).unwrap();
      if (res.success) {
        toast.success("Password updated successfully!");
      } else {
        toast.error(`❌ ${res.message}`);
      }
      setCurrentPassword("");
      setNewPassword("");
    } catch (err) {
      console.error("Error updating password:", err);
      toast.error("❌ Failed to update password. Please try again.");
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-8">Settings</h1>

      {/* Account Information Section */}
      <div className="bg-white rounded-lg p-6 mb-6 shadow-sm">
        <div className="mb-6">
          <h2 className="text-lg font-medium text-gray-900 mb-1">
            Account Information
          </h2>
          <p className="text-sm text-gray-600">Set your personal information</p>
        </div>

        {/* Profile Picture */}
        <div className="mb-6">
          <div className="relative w-16 h-16 mb-4">
            <Image
              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fHByb2ZpbGV8ZW58MHx8MHx8fDA%3D"
              alt="Profile picture"
              width={64}
              height={64}
              className="rounded-full object-cover"
            />
            <button className="absolute -bottom-1 -right-1 bg-blue-600 text-white rounded-full p-1.5 hover:bg-blue-700 transition-colors">
              <Edit3 size={12} />
            </button>
          </div>
        </div>

        {/* Name Fields */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <Label
              htmlFor="firstName"
              className="text-sm font-medium text-gray-700 mb-2 block"
            >
              First Name
            </Label>
            <Input
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full"
              placeholder="First Name"
            />
          </div>
          <div>
            <Label
              htmlFor="lastName"
              className="text-sm font-medium text-gray-700 mb-2 block"
            >
              Last Name
            </Label>
            <Input
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full"
              placeholder="Last Name"
            />
          </div>
        </div>

        <Button
          onClick={handleSaveProfile}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
        >
          Save
        </Button>
      </div>

      {/* Password Section */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <div className="mb-6">
          <h2 className="text-lg font-medium text-gray-900 mb-1">Password</h2>
          <p className="text-sm text-gray-600">Set your password</p>
        </div>

        {/* Password Fields */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <Label
              htmlFor="currentPassword"
              className="text-sm font-medium text-gray-700 mb-2 block"
            >
              Current Password
            </Label>
            <div className="relative">
              <Input
                id="currentPassword"
                type={showCurrentPassword ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full pr-10"
                placeholder="••••••"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <div>
            <Label
              htmlFor="newPassword"
              className="text-sm font-medium text-gray-700 mb-2 block"
            >
              New Password
            </Label>
            <div className="relative">
              <Input
                id="newPassword"
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full pr-10"
                placeholder="••••••"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
        </div>

        <Button onClick={handleUpdatePassword} disabled={isLoading}>
          {isLoading ? "Updating..." : "Update Password"}
        </Button>
      </div>
    </div>
  );
}
