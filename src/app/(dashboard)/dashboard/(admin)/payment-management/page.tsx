import PaymentManagement from '@/components/pages/adminDashboard/PaymentManagement';
import React from 'react'

const page = () => {
  return (
		<div>
			<h2 className="text-[#100C08] font-outfit text-[28px] font-medium leading-[1.2]">
				Payment Management
			</h2>
			<p className="text-[#494949] font-outfit text-[16px] font-normal leading-[1.4]">
				Manage all payments processed through the platform.
			</p>
      <PaymentManagement />
		</div>
	);
}

export default page