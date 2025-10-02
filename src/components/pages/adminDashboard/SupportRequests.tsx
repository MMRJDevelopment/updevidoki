"use client";
import { Table } from "@/components/ui/Table/Table";
import type React from "react";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { IoSearch } from "react-icons/io5";
import { useRouter } from "next/navigation";
import { useGetAllUserTokenListQuery } from "@/redux/features/adminDashbord/adminDashboardApi";
import { Pagination } from "@/components/ui/pagination/Pagination";

export type RequestMeta = {
  id: string;
  name: string;
  image: string;
  email: string;
  requestId: string;
  subject: string;
  action: string;
  status: string;
  priorityLevel: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    profileImage: string;
  };
};
const ITEMS_PER_PAGE = 10;

const SupportRequests = () => {
  const [search, setSearch] = useState<string>("");
  const [openDropdowns, setOpenDropdowns] = useState<{
    [key: string]: boolean;
  }>({});
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const dropdownRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const { data } = useGetAllUserTokenListQuery({
    page: currentPage,
  });
  const requests = data?.data?.data || [];
  const totalItem = data?.data?.total || 0;
  const totalPage = Math.ceil(totalItem / ITEMS_PER_PAGE);

  console.log(requests, "object in support request");

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const clickedOutside = Object.keys(openDropdowns).every((id) => {
        const ref = dropdownRefs.current[id];
        return !ref || !ref.contains(event.target as Node);
      });

      if (clickedOutside) {
        setOpenDropdowns({});
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openDropdowns]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  const handleViewDetails = (row: RequestMeta) => {
    router.push(`/dashboard/support-request/${row?.user?.id}`);
  };

  const columns = [
    {
      header: "User",
      accessor: "user",
      className: "pl-4 pr-12",
      render: (users: RequestMeta) => (
        <div className="flex items-center space-x-3">
          <Image
            src={users?.user?.profileImage || "/image.png"}
            alt={users?.user?.firstName}
            width={32}
            height={32}
            className="w-8 h-8 rounded-full object-cover"
          />
          <span>{users?.user?.firstName}</span>
        </div>
      ),
    },
    {
      header: "Email",
      accessor: "email",
      className: "px-12",
      render: (row: RequestMeta) => <span>{row?.user?.email}</span>,
    },
    {
      header: "Status",
      accessor: "status",
      className: "px-12",
      render: (row: RequestMeta) => <span>{row.status}</span>,
    },
    {
      header: "priorityLevel",
      accessor: "priorityLevel",
      className: "px-12",
      render: (row: RequestMeta) => <span>{row.priorityLevel}</span>,
    },
    {
      header: "Action",
      accessor: "action",
      className: "px-2",
      render: (row: RequestMeta) => (
        <button
          className="w-full text-left px-4 py-2 hover:bg-gray-100"
          onClick={() => handleViewDetails(row)}
        >
          View
        </button>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6 py-6 ">
      <div className="relative w-full flex items-center">
        <input
          value={search}
          onChange={handleSearchChange}
          type="text"
          placeholder="Search Speaker Name..."
          className="text-[#8C8C8C] outline-none  border-[#BFBFBF] border-[1px] cursor-pointer font-dm text-sm font-normal leading-[20px] rounded-[8px] bg-white shadow-[0px_4px_50px_0px_rgba(0,_0,_0,_0.08)] flex h-[44px] px-[12px] py-[10px] pl-[16px] justify-between items-end flex-1 focus:ring-2 focus:ring-blue-500 focus:outline-none focus:border-blue-500"
        />
        <IoSearch className="absolute right-[12px] top-[50%] text-[20px] transform -translate-y-[50%] text-[#8C8C8C]" />
      </div>
      <Table columns={columns} data={requests} />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPage}
        onPageChange={setCurrentPage}
        itemsPerPage={ITEMS_PER_PAGE}
        totalItems={totalItem}
      />
    </div>
  );
};

export default SupportRequests;
