"use client";
import { Modal } from "antd";
import Image from "next/image";
import {
  X,
  Mail,
  Phone,
  Calendar,
  CreditCard,
  Shield,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { UserMetasss } from "@/components/pages/adminDashboard/MemorialManagement";
import { UserMeta } from "@/components/pages/adminDashboard/UserManagement";
import { useGetSingleUserQuery } from "@/redux/features/adminDashbord/adminDashboardApi";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  profileImage: string | null;
  phoneNumber: string | null;
  provider: string;
  role: string;
  status: string;
  isVerified: boolean;
  stripeCustomerId: string;
  createdAt: string;
  updatedAt: string;
}

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: UserMeta | UserMetasss | null;
}

const UserProfileModal = ({
  isOpen,
  onClose,
  userId,
}: UserProfileModalProps) => {
  const id = userId?.id;
  const { data } = useGetSingleUserQuery({ id: id });
  if (!userId) return null;

  const user: User = data?.data || userId;
  //
  console.log(user, "user in modal");

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status: string) => {
    const isActive = status === "ACTIVE";
    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
        }`}
      >
        {isActive ? (
          <CheckCircle size={12} className="mr-1" />
        ) : (
          <XCircle size={12} className="mr-1" />
        )}
        {status}
      </span>
    );
  };

  const getRoleBadge = (role: string) => {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
        <Shield size={12} className="mr-1" />
        {role}
      </span>
    );
  };

  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      footer={null}
      closeIcon={null}
      width={640}
      className="user-profile-modal"
      styles={{
        body: { padding: 0 },
        content: { padding: 0, borderRadius: "12px" },
      }}
    >
      <div className="bg-white rounded-xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X size={20} className="text-gray-500" />
        </button>

        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          User Profile
        </h2>

        <div className="flex gap-6 mb-6">
          <div className="flex-shrink-0">
            <Image
              src={
                user.profileImage ||
                "/placeholder.svg?height=120&width=120&query=user avatar"
              }
              alt={`${user.firstName} ${user.lastName}`}
              width={120}
              height={120}
              className="w-30 h-30 rounded-full object-cover border-2 border-gray-200"
            />
          </div>

          <div className="flex-1">
            <div className="mb-4">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {user.firstName} {user.lastName}
              </h3>
              <div className="flex items-center gap-3 mb-3">
                {getStatusBadge(user.status)}
                {getRoleBadge(user.role)}
                {user.isVerified && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <CheckCircle size={12} className="mr-1" />
                    Verified
                  </span>
                )}
              </div>
              <div className="flex items-center text-gray-600 mb-2">
                <Mail size={16} className="mr-2" />
                <span>{user.email}</span>
              </div>
              {user.phoneNumber && (
                <div className="flex items-center text-gray-600">
                  <Phone size={16} className="mr-2" />
                  <span>{user.phoneNumber}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">
              Account Details
            </h4>
            <div className="space-y-3 text-sm">
              <div>
                <span className="text-gray-600">User ID:</span>
                <p className="font-mono text-xs text-gray-800 break-all">
                  {user.id}
                </p>
              </div>
              <div>
                <span className="text-gray-600">Provider:</span>
                <p className="text-gray-800">{user.provider}</p>
              </div>
              {user.stripeCustomerId && (
                <div>
                  <span className="text-gray-600">Stripe Customer:</span>
                  <div className="flex items-center">
                    <CreditCard size={14} className="mr-1 text-gray-500" />
                    <p className="font-mono text-xs text-gray-800">
                      {user.stripeCustomerId}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Timeline</h4>
            <div className="space-y-3 text-sm">
              <div>
                <span className="text-gray-600">Created:</span>
                <div className="flex items-center">
                  <Calendar size={14} className="mr-1 text-gray-500" />
                  <p className="text-gray-800">{formatDate(user.createdAt)}</p>
                </div>
              </div>
              <div>
                <span className="text-gray-600">Last Updated:</span>
                <div className="flex items-center">
                  <Calendar size={14} className="mr-1 text-gray-500" />
                  <p className="text-gray-800">{formatDate(user.updatedAt)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default UserProfileModal;
