import MemorialManagement from "@/components/pages/adminDashboard/MemorialManagement";
import React from "react";

const page = () => {
  return (
    <div>
      <h2 className="text-[#100C08] font-outfit text-[28px] font-medium leading-[1.2]">
        Memorial Management
      </h2>
      <p className="text-[#494949] font-outfit text-[16px] font-normal leading-[1.4]">
        Manage all memorials created on the platform.
      </p>
      <MemorialManagement />
    </div>
  );
};

export default page;
