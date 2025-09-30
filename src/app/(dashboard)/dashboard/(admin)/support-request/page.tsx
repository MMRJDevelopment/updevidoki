import SupportRequests from "@/components/pages/adminDashboard/SupportRequests";
import React from "react";

const page = () => {
	return (
		<div>
			<h2 className="text-[#100C08] font-outfit text-[28px] font-medium leading-[1.2]">
				Support Requests
			</h2>
			<p className="text-[#494949] font-outfit text-[16px] font-normal leading-[1.4]">
				Manage and respond to user support inquiries efficiently.
			</p>
			<SupportRequests />
		</div>
	);
};

export default page;
