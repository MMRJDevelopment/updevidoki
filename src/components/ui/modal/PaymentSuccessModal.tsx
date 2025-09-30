"use client";

import { Modal } from "antd";
import { useRouter } from "next/navigation";
import { Button } from "../buttons/Button";
import { SuccessIcon } from "@/assets/svg";

interface PaymentSuccessModalProps {
	isOpen: boolean;
	onClose: () => void;
}

export function PaymentSuccessModal({
	isOpen,
	onClose,
}: PaymentSuccessModalProps) {
	const router = useRouter();

	const handleBackToDashboard = () => {
		onClose();
		router.push("/dashboard");
	};

	return (
		<Modal
			open={isOpen}
			onCancel={onClose}
			footer={null}
			width={530}
			centered
			closable={false}
			className="payment-success-modal"
		>
			<div className="text-center flex items-center justify-center flex-col py-8 px-6">
				<SuccessIcon />

				{/* Success Message */}
				<h2 className="text-[#100C08] text-center font-outfit text-[28px] font-medium leading-[120%] mb-3">
					Payment Successful Thank you! Your payment has been received
					successfully.
				</h2>

				<p className="text-[#494949] text-center font-outfit text-base font-normal leading-[140%] mb-2">
					We’re now processing your order and it will be confirmed within 30
					minutes. If you have any questions, our customer support team is here
					to help.
				</p>

				{/* Action Buttons */}
				<div className="space-y-3">
					<Button
						onClick={handleBackToDashboard}
						className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-medium"
					>
						Back to Dashboard
					</Button>
				</div>
			</div>
		</Modal>
	);
}
