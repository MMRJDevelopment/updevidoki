"use client";
import { Button } from "@/components/ui/buttons/Button";
import { ShoppingCart } from "lucide-react";
import Image from "next/image";
// import { useRouter } from "next/navigation";
import qrCode from "@/assets/images/userDashborad/qrCode.png"; // Adjust the path as necessary
import { useState } from "react";
import { MemorialProductModal } from "@/components/ui/modal/MemorialProductModal";

export default function PurchaseQRPage() {
  // const router = useRouter();
  const [showProductModal, setShowProductModal] = useState(false);

  // Removed unused 'stats' state
  // const handlePurchaseFromProduct = () => {
  //   setShowProductModal(false);
  //   router.push("/dashboard/checkout");
  // };
  const handlePurchase = () => {
    setShowProductModal(true);
  };

  return (
    <div className="min-h-screen ">
      <h1
        className="text-[#100C08] font-Outfit text-[28px] font-medium leading-[120%]
"
      >
        Purchase QR Code
      </h1>

      {/* Content */}
      <div
        className="rounded-[4px] mt-6 border border-[#D6D7D9] bg-[#F2F6FF]  flex py-[40px]  flex-col justify-center items-center self-stretch
"
      >
        {/* Description */}
        <p
          className="text-[#595959] text-center font-Outfit text-lg font-light w-[561px] leading-[120%]
"
        >
          Purchase a QR code to easily share and access a personalized memorial
          wall, honoring loved ones with lasting memories and tributes.
        </p>

        <Image
          src={qrCode}
          alt="QR Code"
          width={270}
          height={270}
          className=" my-6"
        />

        {/* Purchase Button */}
        <Button
          onClick={handlePurchase}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-medium shadow-lg hover:shadow-xl transition-all duration-200"
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          Purchase
        </Button>
      </div>

      <MemorialProductModal
        isOpen={showProductModal}
        onOpenChange={setShowProductModal}
        onPurchase={() => console.log("Purchase initiated")}
      />
    </div>
  );
}
