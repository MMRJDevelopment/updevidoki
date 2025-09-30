import type * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "flex h-11 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-900 transition-all duration-200 ease-in-out",
        "placeholder:text-gray-500 placeholder:font-normal",
        "focus:border-blue-500/20 focus:ring-4 focus:ring-blue-100 focus:outline-none",
        "hover:border-gray-300 hover:shadow-sm",
        "disabled:cursor-not-allowed disabled:opacity-60 disabled:bg-gray-50",
        "aria-invalid:border-red-500 aria-invalid:ring-4 aria-invalid:ring-red-100",
        "dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-400",
        "dark:focus:border-blue-400 dark:focus:ring-blue-900/30",
        "dark:hover:border-gray-600 dark:disabled:bg-gray-800",
        "dark:aria-invalid:border-red-400 dark:aria-invalid:ring-red-900/30",
        "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-gray-900 dark:file:text-gray-100",
        className,
      )}
      {...props}
    />
  )
}

export { Input }
