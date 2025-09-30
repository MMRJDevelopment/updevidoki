"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CreditCard, Lock, CheckCircle } from "lucide-react";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/components/ui/card/Card";
import { PaymentSuccessModal } from "@/components/ui/modal/PaymentSuccessModal";

export default function Checkout() {
	const [showSuccessModal, setShowSuccessModal] = useState(false);
	const [formData, setFormData] = useState({
		cardHolderName: "John David",
		cardNumber: "123 456789 3456",
		expirationDate: "",
		securityCode: "",
		country: "UK",
	});

	const handleInputChange = (field: string, value: string) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
	};

	const handleConfirmPurchase = () => {
		// Simulate payment processing
		setShowSuccessModal(true);
	};

	const formatCardNumber = (value: string) => {
		const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
		const matches = v.match(/\d{4,16}/g);
		const match = (matches && matches[0]) || "";
		const parts = [];
		for (let i = 0, len = match.length; i < len; i += 4) {
			parts.push(match.substring(i, i + 4));
		}
		if (parts.length) {
			return parts.join(" ");
		} else {
			return v;
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4">
			<div>
				{/* Header */}

				<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
					{/* Left Side - Order Summary */}
					<div className="space-y-6">
						<h4 className="text-[#0C0906] font-outfit text-[28px] font-medium leading-[120%]">
							Checkout
						</h4>
						<Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
							<CardHeader className="pb-4">
								<CardTitle className="flex items-center gap-2 text-xl">
									<CheckCircle className="h-5 w-5 text-emerald-600" />
									Order Summary
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="flex items-start justify-between p-4 bg-slate-50 rounded-lg">
									<div className="flex-1">
										<h3 className="font-semibold text-slate-900 text-lg mb-1">
											A Memory That Lives On
										</h3>
										<p className="text-slate-600 text-sm mb-3">
											Digital Memory Package
										</p>
										<Badge variant="secondary" className="text-xs">
											Premium Edition
										</Badge>
									</div>
									<div className="text-right">
										<p className="text-2xl font-bold text-slate-900">$99.00</p>
									</div>
								</div>

								<Separator />

								<div className="space-y-3">
									<div className="flex justify-between text-sm">
										<span className="text-slate-600">Subtotal</span>
										<span className="font-medium">$99.00</span>
									</div>
									<div className="flex justify-between text-sm">
										<span className="text-slate-600">Quantity</span>
										<span className="font-medium">1</span>
									</div>
									<div className="flex justify-between text-sm">
										<span className="text-slate-600">Processing Fee</span>
										<span className="font-medium text-emerald-600">Free</span>
									</div>
									<Separator />
									<div className="flex justify-between text-lg font-bold">
										<span>Total</span>
										<span className="text-slate-900">$99.00</span>
									</div>
								</div>
							</CardContent>
						</Card>
					</div>

					{/* Right Side - Payment Information */}
					<div className="space-y-6">
						<h4 className="text-[#0C0906] font-outfit text-[28px] font-medium leading-[120%]">
							Payment Information
						</h4>
						<Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
							<CardHeader className="pb-4">
								<CardTitle className="flex items-center gap-2 text-xl">
									<Lock className="h-5 w-5 text-blue-600" />
									Payment Information
								</CardTitle>
								<p className="text-sm text-slate-600">
									Your payment details are encrypted and secure
								</p>
							</CardHeader>
							<CardContent className="space-y-6">
								{/* Payment Method */}
								<div className="space-y-3">
									<Label className="text-sm font-medium">Payment Method</Label>
									<div className="flex items-center gap-3 p-3 border-2 border-blue-200 bg-blue-50 rounded-lg">
										<div className="flex items-center justify-center w-10 h-8 bg-blue-600 rounded">
											<CreditCard className="h-4 w-4 text-white" />
										</div>
										<span className="font-medium text-blue-900">
											Credit/Debit Card
										</span>
										<div className="ml-auto w-4 h-4 rounded-full border-2 border-blue-600 bg-blue-600 flex items-center justify-center">
											<div className="w-2 h-2 bg-white rounded-full"></div>
										</div>
									</div>
								</div>

								{/* Card Holder Name */}
								<div className="space-y-2">
									<Label
										htmlFor="cardHolderName"
										className="text-sm font-medium"
									>
										Card Holder Name
									</Label>
									<Input
										id="cardHolderName"
										value={formData.cardHolderName}
										onChange={(e) =>
											handleInputChange("cardHolderName", e.target.value)
										}
										className="h-12 border-slate-300 focus:border-blue-500 focus:ring-blue-500"
										placeholder="Enter full name as shown on card"
									/>
								</div>

								{/* Card Number */}
								<div className="space-y-2">
									<div className="flex justify-between items-center">
										<Label htmlFor="cardNumber" className="text-sm font-medium">
											Card Number
										</Label>
										<button className="text-blue-600 text-sm font-medium hover:underline transition-colors">
											Hide
										</button>
									</div>
									<Input
										id="cardNumber"
										value={formData.cardNumber}
										onChange={(e) =>
											handleInputChange(
												"cardNumber",
												formatCardNumber(e.target.value)
											)
										}
										className="h-12 border-slate-300 focus:border-blue-500 focus:ring-blue-500 font-mono"
										placeholder="1234 5678 9012 3456"
										maxLength={19}
									/>
								</div>

								{/* Expiration Date and Security Code */}
								<div className="grid grid-cols-2 gap-4">
									<div className="space-y-2">
										<Label
											htmlFor="expirationDate"
											className="text-sm font-medium"
										>
											Expiry Date
										</Label>
										<Input
											id="expirationDate"
											value={formData.expirationDate}
											onChange={(e) =>
												handleInputChange("expirationDate", e.target.value)
											}
											className="h-12 border-slate-300 focus:border-blue-500 focus:ring-blue-500 font-mono"
											placeholder="MM/YY"
											maxLength={5}
										/>
									</div>
									<div className="space-y-2">
										<Label
											htmlFor="securityCode"
											className="text-sm font-medium"
										>
											CVV
										</Label>
										<Input
											id="securityCode"
											value={formData.securityCode}
											onChange={(e) =>
												handleInputChange("securityCode", e.target.value)
											}
											className="h-12 border-slate-300 focus:border-blue-500 focus:ring-blue-500 font-mono"
											placeholder="123"
											maxLength={4}
											type="password"
										/>
									</div>
								</div>

								{/* Country */}
								<div className="space-y-2">
									<Label htmlFor="country" className="text-sm font-medium">
										Billing Country
									</Label>
									<Select
										value={formData.country}
										onValueChange={(value) =>
											handleInputChange("country", value)
										}
									>
										<SelectTrigger className="h-12 border-slate-300 focus:border-blue-500 focus:ring-blue-500">
											<SelectValue placeholder="Select your country" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="UK">United Kingdom</SelectItem>
											<SelectItem value="US">United States</SelectItem>
											<SelectItem value="CA">Canada</SelectItem>
											<SelectItem value="AU">Australia</SelectItem>
										</SelectContent>
									</Select>
								</div>

								{/* Confirm Purchase Button */}
								<Button
									onClick={handleConfirmPurchase}
									className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
								>
									<Lock className="h-4 w-4 mr-2" />
									Complete Secure Purchase
								</Button>
							</CardContent>
						</Card>
					</div>
				</div>
			</div>

			<PaymentSuccessModal
				isOpen={showSuccessModal}
				onClose={() => setShowSuccessModal(false)}
			/>
		</div>
	);
}
