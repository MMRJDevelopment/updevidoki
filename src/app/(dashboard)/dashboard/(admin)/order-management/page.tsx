import OrderManagement from "@/components/pages/adminDashboard/OrderManagement";
import React from "react";

const page = () => {
  return (
    <div>
      <h2 className="text-[#100C08] font-outfit text-[28px] font-medium leading-[1.2]">
        Order Management
      </h2>
      <p className="text-[#494949] font-outfit text-[16px] font-normal leading-[1.4]">
        Manage all customer orders placed on the platform
      </p>
      <OrderManagement />
    </div>
  );
};

export default page;
