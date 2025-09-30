import UserManagement from "@/components/pages/adminDashboard/UserManagement";
import React from "react";

const page = () => {
  return (
    <div>
      <h2 className="text-[#100C08] font-outfit text-[28px] font-medium leading-[1.2]">
        User Management
      </h2>
      <p className="text-[#494949] font-outfit text-[16px] font-normal leading-[1.4]">
        Manage all users registered on the platform.
      </p>
      <UserManagement />
    </div>
  );
};

export default page;
