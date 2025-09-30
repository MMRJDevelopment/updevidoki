"use client";

import type React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  X,
  QrCode,
  User,
  CreditCard,
  Calendar,
  Hash,
  DollarSign,
} from "lucide-react";
import Image from "next/image";

export interface OrderData {
  id: string;
  userId: string;
  amount: number;
  quantity: number;
  paymentId: string;
  status: string;
  orderNo: string;
  qrCode: string;
  isUsed: boolean;
  createdAt: string;
  updatedAt: string;
  user: {
    email: string;
  };
}

interface OrderDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: OrderData | null;
}

const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({
  isOpen,
  onClose,
  order,
}) => {
  if (!order) return null;

  // Format date to match the design (May 12, 2025)
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case "COMPLETED":
        return "bg-green-100 text-green-800 border-green-200";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "FAILED":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md p-0 gap-0">
        <div className="bg-card rounded-lg">
          {/* Header */}
          <div className="flex justify-between items-center p-6 pb-4 border-b border-border">
            <div>
              <h2 className="text-lg font-semibold text-card-foreground flex items-center gap-2">
                <Hash className="w-4 h-4" />
                {order.orderNo.split("-")[0]}
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Order details
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-muted-foreground hover:text-card-foreground transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* QR Code Section */}
            <div>
              <h3 className="text-sm font-medium text-card-foreground mb-3 flex items-center gap-2">
                <QrCode className="w-4 h-4" />
                QR Code
              </h3>
              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div className="flex items-center space-x-3">
                  {/* QR Code Image */}
                  <div className="w-12 h-12 bg-background rounded border overflow-hidden">
                    <Image
                      src={order.qrCode || "/placeholder.svg"}
                      width={48}
                      height={48}
                      alt="QR Code"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-card-foreground">
                      QR Code Purchase
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {order.quantity} pcs • {order.isUsed ? "Used" : "Unused"}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-card-foreground">
                    ${order.amount}
                  </p>
                  <Badge
                    variant={order.isUsed ? "secondary" : "default"}
                    className="text-xs mt-1"
                  >
                    {order.isUsed ? "Used" : "Available"}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Order Information */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-card-foreground">
                Order Information
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Amount</p>
                      <p className="text-sm font-medium text-card-foreground">
                        ${order.amount}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Hash className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Quantity</p>
                      <p className="text-sm font-medium text-card-foreground">
                        {order.quantity}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Payment ID
                      </p>
                      <p className="text-sm font-medium text-card-foreground font-mono">
                        {order.paymentId.slice(-8)}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Status</p>
                    <Badge className={getStatusColor(order.status)}>
                      {order.status}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            {/* Customer & Timeline */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Customer</p>
                  <p className="text-sm font-medium text-card-foreground">
                    {order.user.email}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Created</p>
                    <p className="text-sm font-medium text-card-foreground">
                      {formatDate(order.createdAt)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Updated</p>
                    <p className="text-sm font-medium text-card-foreground">
                      {formatDate(order.updatedAt)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Order IDs */}
            <div className="bg-muted p-4 rounded-lg space-y-2">
              <div>
                <p className="text-xs text-muted-foreground">Order ID</p>
                <p className="text-sm font-mono text-card-foreground">
                  {order.id}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">User ID</p>
                <p className="text-sm font-mono text-card-foreground">
                  {order.userId}
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailsModal;
