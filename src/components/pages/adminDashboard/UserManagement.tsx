"use client";
import ProfileModal from "@/components/ui/modal/ProfileModal";
import { Pagination } from "@/components/ui/pagination/Pagination";
import { Table } from "@/components/ui/Table/Table";
import {
  useGetAllUserDashboardDataQuery,
  useUpdateUserStatusMutation,
} from "@/redux/features/adminDashbord/adminDashboardApi";
import { Select } from "antd";
import Image from "next/image";
import React, { useState } from "react";
import { IoSearch } from "react-icons/io5";
import { toast } from "sonner";

export type UserMeta = {
  id: string;
  firstName: string;
  profileImage: string;
  email: string;
  status: "ACTIVE" | "BLOCKED";
  actions: string;
};

const UserManagement = () => {
  const [search, setSearch] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserMeta | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const { data } = useGetAllUserDashboardDataQuery({
    page: currentPage,
    limit: 10,
    searchTerm: search,
  });
  const [updateUserStatus] = useUpdateUserStatusMutation();
  const users = data?.data?.data || [];
  console.log(users[0]);

  const ITEMS_PER_PAGE = 5;
  const totalItem = data?.data?.total || 0;
  const totalPage = Math.ceil(totalItem / ITEMS_PER_PAGE);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  const handleViewDetails = (row: UserMeta) => {
    setSelectedUser(row);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const columns = [
    {
      header: "User",
      accessor: "user",
      className: "pl-4 pr-12",
      render: (users: UserMeta) => (
        <div className="flex items-center space-x-3">
          <Image
            src={users?.profileImage}
            alt={users?.firstName}
            width={32}
            height={32}
            className="w-8 h-8 rounded-full object-cover"
          />
          <span>{users?.firstName}</span>
        </div>
      ),
    },
    {
      header: "Email",
      accessor: "email",
      className: "px-12",
    },
    {
      header: "Status",
      accessor: "status",
      className: "px-12",
      render: (row: UserMeta) => (
        <div className="relative inline-block">
          <Select
            value={row.status}
            onChange={async (e) => {
              const newStatus = e;
              try {
                const res = await updateUserStatus({
                  userId: row.id, // replace with your user identifier key
                  status: newStatus,
                }).unwrap(); // unwrap() to catch error properly
                if (res?.success) {
                  toast.success("Status updated successfully:", res);
                }
              } catch (error) {
                console.error("Failed to update status:", error);
              }
            }}
            className={`appearance-none px-3 py-2 rounded-full text-xs font-semibold outline-none ${
              row.status === "ACTIVE"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            } pr-8`} // add padding-right for the icon
          >
            <option value="ACTIVE">Active</option>
            <option value="BLOCKED">Blocked</option>
          </Select>

          {/* Custom arrow */}
          <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center">
            <svg
              className="w-4 h-4 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
      ),
    },
    {
      header: "Action",
      accessor: "action",
      className: "px-2",
      render: (row: UserMeta) => (
        <div className="flex items-center space-x-2">
          <button
            className="flex w-[118px] h-8 px-3 py-2 justify-between items-center rounded-[24px] bg-[var(--foundation-blue-light-hover,#DEE8FC)] text-[var(--Foundation-Blue-Normal,#2563EB)] font-outfit text-base font-normal leading-[140%]"
            onClick={() => handleViewDetails(row)}
          >
            View Profile
          </button>
        </div>
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
          className="text-[#8C8C8C] outline-none border-[#BFBFBF] border-[1px] cursor-pointer font-dm text-sm font-normal leading-[20px] rounded-[8px] bg-white shadow-[0px_4px_50px_0px_rgba(0,_0,_0,_0.08)] flex h-[44px] px-[12px] py-[10px] pl-[16px] justify-between items-end flex-1 focus:ring-2 focus:ring-blue-500 focus:outline-none focus:border-blue-500"
        />
        <IoSearch className="absolute right-[12px] top-[50%] text-[20px] transform -translate-y-[50%] text-[#8C8C8C]" />
      </div>
      <Table columns={columns} data={users} />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPage}
        onPageChange={setCurrentPage}
        itemsPerPage={ITEMS_PER_PAGE}
        totalItems={totalItem}
      />
      <ProfileModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        userId={selectedUser}
      />
    </div>
  );
};

export default UserManagement;
