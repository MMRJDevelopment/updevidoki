import { MenuItem } from "@/types/dashbord/userRole";
import { TbLayoutDashboardFilled } from "react-icons/tb";
import { MdQrCode } from "react-icons/md";
import { BiSupport } from "react-icons/bi";
import { GiRoyalLove } from "react-icons/gi";
import { FaCartShopping, FaUsers } from "react-icons/fa6";
import { GiWallet } from "react-icons/gi";
import { IoMdSettings } from "react-icons/io";

import { FaCog } from "react-icons/fa";

const DashboardIcon = TbLayoutDashboardFilled;
const SettingsIcon = FaCog;
export const menuItems: MenuItem[] = [
  {
    key: "dashboard",
    label: "Dashboard",
    icon: <DashboardIcon className="w-5 h-5" />,
    href: "/dashboard/admin",
    roles: ["SUPER_ADMIN"],
  },
  {
    key: "USER Management",
    label: "USER Management",
    icon: <FaUsers className="w-5 h-5" />,
    href: "/dashboard/user-management",
    roles: ["SUPER_ADMIN"],
  },
  {
    key: "Memorial Management",
    label: "Memorial Management",
    icon: <GiRoyalLove className="w-5 h-5" />,
    href: "/dashboard/memorial-management",
    roles: ["SUPER_ADMIN"],
  },
  {
    key: "Order Management",
    label: "Order Management",
    icon: <FaCartShopping className="w-5 h-5" />,
    href: "/dashboard/order-management",
    roles: ["SUPER_ADMIN"],
  },
  {
    key: "Payment Management",
    label: "Payment Management",
    icon: <GiWallet className="w-5 h-5" />,
    href: "/dashboard/payment-management",
    roles: ["SUPER_ADMIN"],
  },
  {
    key: "Support Request",
    label: "Support Request",
    icon: <BiSupport className="w-5 h-5" />,
    href: "/dashboard/support-request",
    roles: ["SUPER_ADMIN"],
  },
  {
    key: "Account Setting",
    label: "Account Setting",
    icon: <IoMdSettings className="w-5 h-5" />,
    href: "/dashboard/setting",
    roles: ["SUPER_ADMIN"],
  },

  //   {
  //   	key: "manual-poster-requests",
  //   	icon: <ChatIcon isActive={false} />,
  //   	label: "Manual Poster Requests",
  //   	href: "/dashboard/manual-poster-requests",
  //   	roles: ["USER"],
  //   },

  // USER Sections

  {
    key: "dashboard",
    icon: <TbLayoutDashboardFilled className="w-5 h-5" />,
    label: "Dashboard",
    href: "/dashboard",
    roles: ["USER"],
  },
  {
    key: "QR Code",
    icon: <MdQrCode className="w-5 h-5" />,
    label: "QR Code",
    href: "/dashboard/qr-code",
    roles: ["USER"],
  },
  {
    key: "Support",
    icon: <BiSupport className="w-5 h-5" />,
    label: "Support",
    href: "/dashboard/support",
    roles: ["USER"],
  },
  {
    key: "settings",
    icon: <SettingsIcon />,
    label: "Settings",
    href: "/dashboard/account-setting",
    roles: ["USER"],
  },
];
