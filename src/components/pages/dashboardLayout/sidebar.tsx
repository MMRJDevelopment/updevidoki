"use client";

import { Settings, LogOut, Menu } from "lucide-react";

import Link from "next/link";
import { useState } from "react";
import { logoutHandler } from "@/utils/handleLogout";
import { useRouter, usePathname } from "next/navigation";
import { useDispatch } from "react-redux";
import Logo from "@/assets/images/logo/LogoBlue.png";

import { menuItems } from "@/utils/dashbord/menuItems";
import Image from "next/image";
import NavMenu from "./NavItem";
import { useAppSelector } from "@/redux/hooks";

export default function Sidebar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [sidebarCollapsed] = useState(false);
  const [isMobile] = useState(false);
  const userRolle = useAppSelector((state) => state.auth.user);
  console.log(userRolle, "role");

  const user = userRolle?.role; // Replace with actual user role logic

  // const user = "ADMIN"; // Replace with actual user role logic

  const pathname = usePathname();

  // Function to check if a menu item is active
  const isActive = (href: string) => pathname === href;

  function NavItem({
    href = "#",
    icon: IconComponent,
    children,
  }: {
    href?: string;
    icon?: React.ComponentType<{ isActive: boolean }>;
    children: React.ReactNode;
  }) {
    const active = isActive(href);

    return (
      <Link
        href={href}
        className={`flex items-center bg-[#DEE8FC] px-3 py-2 text-sm md:text-base rounded-md transition-colors 
        ${
          active
            ? "text-[#0380E1] bg-[#DEE8FC] "
            : " bg-[#DEE8FC] text-[#2C2B44]"
        } 
        hover:text-gray-900 hover:bg-gray-100`}
      >
        {IconComponent && <IconComponent isActive={active} />}
        {children}
      </Link>
    );
  }

  const router = useRouter();
  const dispatch = useDispatch();
  const handleLogout = () => {
    logoutHandler(dispatch, router);
    window.dispatchEvent(new Event("logout"));
  };

  return (
    <>
      <button
        type="button"
        className="lg:hidden fixed top-4 left-4 z-[70] p-2 rounded-lg bg-[#DEE8FC] shadow-md"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        <Menu className="h-5 w-5 text-gray-600" />
      </button>
      <nav
        className={`fixed inset-y-0 left-0 z-[70] w-64 bg-[#DEE8FC] transform transition-transform duration-200 ease-in-out
                lg:translate-x-0 lg:static lg:w-64 
                ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="h-full flex flex-col ">
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="  flex items-center w-full justify-center pb-4 pt-6"
          >
            <Image
              src={Logo}
              alt="Logo"
              width={80}
              height={80}
              className="w-20 h-auto"
            />
          </Link>

          <div className="flex-1 overflow-y-auto py-4 px-4 border-r border-[#E6E6EC]">
            <div className="space-y-6">
              <div>
                <div className="space-y-1">
                  <NavMenu
                    items={menuItems}
                    userRole={user}
                    mode="inline"
                    collapsed={sidebarCollapsed && !isMobile}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="px-4 py-4 border-t border-gray-200">
            <div className="space-y-1">
              <NavItem
                href="/settings"
                icon={({ isActive }) => (
                  <Settings
                    className={`h-5 w-5 mr-3 flex-shrink-0 ${
                      isActive ? "text-[#0380E1]" : ""
                    }`}
                  />
                )}
              >
                Settings
              </NavItem>
              <NavItem>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center"
                >
                  <LogOut size={35} className="h-5 w-5 mr-3" />
                  <span className="text-sm md:text-base text-gray-600">
                    Logout
                  </span>
                </button>
              </NavItem>
            </div>
          </div>
        </div>
      </nav>

      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-[65] lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
}
