'use client';

import { OppsIcon, PurchaseIcon } from "@/assets/svg";
import { Button } from "../buttons/Button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "../dialog";

interface EmptyStateModalProps {
	isOpen: boolean;
	onOpenChange: (open: boolean) => void;
	onPurchase: () => void;
}

export function EmptyStateModal({
	isOpen,
	onOpenChange,
	onPurchase,
}: EmptyStateModalProps) {
	return (
		<Dialog open={isOpen} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle className="sr-only">Create Memorial</DialogTitle>
					<DialogDescription className="sr-only">
						Create a beautiful memorial page to honor and remember a loved one.
					</DialogDescription>
				</DialogHeader>

				{/* Illustration */}
				<div className="flex justify-center py-8">
					<OppsIcon />
				</div>

				{/* Content */}
				<div className="text-center space-y-4 pb-6">
					<h2 className="text-[#100C08] text-center font-Outfit text-xl font-medium leading-[120%]">
						Oops! There&#39;s nothing here...
					</h2>
					<p className="text-[#494949] text-center font-Outfit text-base font-normal leading-[140%]">
						There is nothing here to view right now, please purchase QR code and
						get started
					</p>
				</div>

				{/* Action Buttons */}
				<div className="flex space-x-3 pb-2">
					<Button
						variant="secondary"
						onClick={() => onOpenChange(false)}
						className="rounded-[28px] bg-[#DEE8FC] flex h-[38px] px-[75px] py-[20px] justify-between text-center items-center text-[#100C08] font-Outfit text-base font-normal leading-[140%]"
					>
						Cancel
					</Button>
					<Button
						onClick={onPurchase}
						className="text-white font-Outfit text-base font-normal leading-[140%] flex py-2 px-4 justify-center items-center gap-2 rounded-[28px] bg-[#2563EB]"
					>
						<PurchaseIcon/>
						Purchase QR Code
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}