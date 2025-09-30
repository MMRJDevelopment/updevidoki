/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Plus, Minus, Loader2 } from "lucide-react";
import { Modal, message } from "antd";

interface MemorialProductModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onPurchase?: () => void;
}

import img1 from "@/assets/images/userDashborad/qr1.png";
import img2 from "@/assets/images/userDashborad/qr2.png";
import img3 from "@/assets/images/userDashborad/qr3.png";
import img4 from "@/assets/images/userDashborad/qr4.png";
import Image from "next/image";
import { StarRating } from "../star-rating";
import { Button } from "../buttons/Button";
import { useCreatePaymentsMutation } from "@/redux/features/payments/paymentsApi";

export function MemorialProductModal({
  isOpen,
  onOpenChange,
  onPurchase,
}: MemorialProductModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // RTK Query mutation hook
  const [createPayment, { isLoading: isCreatingPayment }] =
    useCreatePaymentsMutation();

  const productImages = [img1, img2, img3, img4];

  const incrementQuantity = () => setQuantity((prev) => prev + 1);
  const decrementQuantity = () => setQuantity((prev) => Math.max(1, prev - 1));
  const PRODUCT_PRICE = 49; // Single unit price
  const totalPrice = PRODUCT_PRICE * quantity;
  // Payment handle করার function
  const handlePurchase = async () => {
    try {
      const paymentData = {
        amount: PRODUCT_PRICE, // total amount
        quantity: quantity,
      };

      const response = await createPayment(paymentData).unwrap();

      if (response.success && response.data.url) {
        // Success message show করুন
        message.success("Redirecting to payment...");

        // Stripe checkout page এ redirect করুন
        window.location.href = response.data.url;

        // Optional: onPurchase callback call করুন
        if (onPurchase) {
          onPurchase();
        }
      } else {
        throw new Error(response.message || "Payment creation failed");
      }
    } catch (error: any) {
      console.error("Payment creation error:", error);
      message.error(
        error.message || "Payment creation failed. Please try again."
      );
    }
  };

  return (
    <Modal
      open={isOpen}
      onCancel={() => onOpenChange(false)}
      footer={null}
      width={1000}
      centered
      className="memorial-product-modal"
    >
      <div className="p-6">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Left side - Images */}
          <div className="space-y-4">
            {/* Main product image */}
            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
              <Image
                src={productImages[activeImageIndex]}
                alt="Memorial medallion main view"
                height={400}
                width={400}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Sub-images */}
            <div className="flex gap-3 justify-center">
              {productImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImageIndex(index)}
                  className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                    activeImageIndex === index
                      ? "border-blue-500 ring-2 ring-blue-200"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <Image
                    src={image}
                    alt={`Memorial medallion view ${index + 1}`}
                    className="w-full h-full object-cover"
                    height={80}
                    width={80}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right side - Product details */}
          <div className="space-y-6">
            <div>
              <h2 className="text-[#100C08] font-Outfit sm:text-2xl text-xl lg:text-3xl font-medium leading-[120%] mb-2">
                A Memory That Lasts Forever
              </h2>
              <div className="text-[#2563EB] font-Outfit text-xl lg:text-[28px] font-medium leading-[120%] mb-3">
                ${PRODUCT_PRICE}.00{" "}
                {quantity > 1 && (
                  <span className="text-sm text-gray-600">each</span>
                )}
              </div>

              {/* Total price যদি multiple quantity হয় */}
              {quantity > 1 && (
                <div className="text-gray-700 font-medium mb-3">
                  Total:{" "}
                  <span className="text-[#2563EB] text-lg">
                    ${totalPrice}.00
                  </span>
                </div>
              )}

              <div className="flex items-center gap-2 mb-4">
                <StarRating value={5} />
                <span className="text-[#494949] font-[Outfit] text-[16px] font-normal leading-[140%]">
                  (99 Reviews)
                </span>
              </div>
            </div>

            {/* Features */}
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <span className="text-gray-400 mt-1">•</span>
                <span className="text-black font-Outfit text-base font-normal leading-[140%]">
                  1 personalized memorial medallion
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-gray-400 mt-1">•</span>
                <span className="text-black font-Outfit text-base font-normal leading-[140%]">
                  Perfect for Headstones, Memorial Walls, or Keepsakes
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-gray-400 mt-1">•</span>
                <span className="text-black font-Outfit text-base font-normal leading-[140%]">
                  Personalized with Name, Dates & Bio
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-gray-400 mt-1">•</span>
                <span className="text-black font-Outfit text-base font-normal leading-[140%]">
                  Custom engraving available for a personal touch
                </span>
              </div>
            </div>

            {/* Description */}
            <p className="text-gray-600 leading-relaxed">
              Personalize each medallion with your loved one&#39;s name,
              important dates, and a heartfelt message creating a timeless
              keepsake that honors their memory with beauty and meaning
            </p>

            {/* Quantity and Purchase */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <button
                  onClick={decrementQuantity}
                  disabled={isCreatingPayment}
                  className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  <Minus size={16} />
                </button>
                <span className="text-lg font-medium w-8 text-center">
                  {quantity}
                </span>
                <button
                  onClick={incrementQuantity}
                  disabled={isCreatingPayment}
                  className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  <Plus size={16} />
                </button>
              </div>

              <Button
                onClick={handlePurchase}
                disabled={isCreatingPayment}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-full text-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isCreatingPayment ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Processing...
                  </>
                ) : (
                  `Purchase - $${totalPrice}.00`
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
