"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Dashboard } from "./Dashbordcom";
import { EmptyStateModal } from "@/components/ui/modal/EmptyStateModal";

export default function CreateNewMemorial() {
  const router = useRouter();

  const [showEmptyModal, setShowEmptyModal] = useState(false);

  const handleCreateMemorial = () => {
    setShowEmptyModal(true);
  };

  const handlePurchaseQRCode = () => {
    router.push("/dashboard/qr-code");
  };

  const handlePurchaseFromEmpty = () => {
    setShowEmptyModal(false);
    router.push("/dashboard/qr-code");
  };

  return (
    <>
      <Dashboard
        onCreateMemorial={handleCreateMemorial}
        onPurchaseQRCode={handlePurchaseQRCode}
      />

      <EmptyStateModal
        isOpen={showEmptyModal}
        onOpenChange={setShowEmptyModal}
        onPurchase={handlePurchaseFromEmpty}
      />
    </>
  );
}
