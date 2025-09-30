import { DropdownMenu, DropdownMenuTrigger } from "./dropdown-menu";
import Image from "next/image";

import NotificationDetails from "./NotificationDetails";
import TimeBasedGreeting from "@/components/ui/TimeBased/TimeBasedGreeting";

export default function TopNav() {
  return (
    <nav className="px-3 sm:px-6 flex items-center justify-between bg-white   h-full">
      <TimeBasedGreeting />

      <div className="flex items-center gap-2 ml-auto lg:ml-0">
        <NotificationDetails />
        <DropdownMenu>
          <DropdownMenuTrigger className="focus:outline-none">
            <div className="flex items-center gap-2">
              <Image
                src="https://ferf1mheo22r9ira.public.blob.vercel-storage.com/avatar-02-albo9B0tWOSLXCVZh9rX9KFxXIVWMr.png"
                alt="User avatar"
                width={28}
                height={28}
                className="rounded-full ring-2 ring-gray-200 dark:ring-[#2B2B30] sm:w-9 sm:h-9 cursor-pointer"
              />
            </div>
          </DropdownMenuTrigger>
        </DropdownMenu>
      </div>
    </nav>
  );
}
