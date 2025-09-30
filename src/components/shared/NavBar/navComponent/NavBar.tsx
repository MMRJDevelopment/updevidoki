"use client";
import React from "react";
import { Navbar } from "../navbar";
import NavLogo from "@/assets/images/logo/logo.png";
import { useRouter } from "next/navigation";

const NavBar = () => {
  const router = useRouter();
  const navItems = [
    {
      label: "Home",
      path: "/",
    },
    {
      label: "About Us",
      path: "/about-us",
    },
  ];

  // Example buttons with custom components
  const buttons = [
    {
      label: "Login",
      onClick: () => console.log("/auth/login"),
      component: (
        <button
          className="text-[#0C0906] font-outfit text-[20px] font-normal leading-[140%] cursor-pointer"
          onClick={() => router.push("/auth/login")}
        >
          Login
        </button>
      ),
    },
    {
      label: "Sign Up",
      onClick: () => router.push("/auth/register"),
      component: (
        <button
          className="text-white cursor-pointer font-outfit text-sm md:text-base font-medium leading-[120%] rounded-[28px] bg-[#2563EB] flex w-[144px] h-[48px] p-4 justify-center items-center gap-[10px]"
          onClick={() => router.push("/auth/register")}
        >
          Sign Up
        </button>
      ),
    },
  ];

  // Example conditional routes
  const conditionalRoutes = {
    "/pricing": true, // Show pricing page
    "/admin": false, // Hide admin page
  };

  return (
    <div className="mb-16 lg:mb-20">
      <Navbar
        className="max-w-full mx-auto"
        position="fixed"
        shadow="shadow-none"
        backgroundColor="bg-[#FFF] lg:py-4"
        logo={NavLogo.src}
        activeTextColor="text-[#2563EB] font-outfit text-base font-medium leading-[120%] hover:!text-accent-light"
        textColor="text-nav-text font-medium"
        hoverTextColor="hover:text-nav-text-light"
        navItems={navItems}
        buttons={buttons}
        hideOnScroll
        conditionalRoutes={conditionalRoutes}
        onNavItemClick={(item) => console.log("Nav item clicked:", item.label)}
        onButtonClick={(index, button) =>
          console.log(`Button ${index} clicked:`, button.label)
        }
      />
    </div>
  );
};

export default NavBar;
