"use client";
import ProfileModal from "@/components/ui/modal/ProfileModal";
import { Pagination } from "@/components/ui/pagination/Pagination";
import { Table } from "@/components/ui/Table/Table";
import { useGetUserMemorialsQuery } from "@/redux/features/userDashbord/userDashbordApi";
import Image from "next/image";
import React, { useState } from "react";
import { IoSearch } from "react-icons/io5";

export type UserMetasss = {
  id: string;
  name: string;
  image: string;
  date: string;
  status: "Published" | "Draft";
  actions: string;
  fullName: string;
  coverPhoto: string;
  privacy: "PUBLIC" | "PRIVATE";
};

const MemorialManagement = () => {
  const [search, setSearch] = useState<string>("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserMetasss | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const { data: memorialsData, isLoading: memorialsLoading } =
    useGetUserMemorialsQuery({
      page: 1,
      limit: 10,
    });

  if (memorialsLoading) {
    return <div>Loading...</div>;
  }

  const ITEMS_PER_PAGE = 5;
  const totalItem = memorialsData?.data?.total || 0;
  const totalPage = Math.ceil(totalItem / ITEMS_PER_PAGE);

  const memorials = memorialsData?.data?.data || [];
  console.log(memorials, "memorials");

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  const handleViewDetails = (row: UserMetasss) => {
    setSelectedUser(row);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const columns = [
    {
      header: "Memorial",
      accessor: "memorial",
      className: "pl-4 pr-12",
      render: (memorial: UserMetasss) => (
        <div className="flex items-center space-x-3">
          <Image
            src={memorial.coverPhoto}
            alt={memorial.fullName}
            width={32}
            height={32}
            className="w-8 h-8 rounded-full object-cover"
          />
          <span>{memorial.fullName}</span>
        </div>
      ),
    },

    {
      header: "Status",
      accessor: "status",
      className: "px-12",
      render: (row: UserMetasss) => (
        <div>
          {row.privacy === "PUBLIC" ? (
            <span className="flex w-[116px] h-8 px-3 py-2  text-center justify-center items-center rounded-[24px] bg-[var(--foundation-blue-light-hover,#DEE8FC)] text-[var(--Foundation-Blue-Normal,#2563EB)] font-outfit text-base font-normal leading-[140%]">
              PUBLIC
            </span>
          ) : (
            <span className="flex w-[116px] h-8 px-3 py-2  text-center justify-center items-center rounded-[24px] bg-[#FAECE9] text-[#881212] font-outfit text-base font-normal leading-[140%]">
              PRIVATE
            </span>
          )}
        </div>
      ),
    },
    {
      header: "Date",
      accessor: "date",
      className: "px-12",
    },
    {
      header: "Action",
      accessor: "action",
      className: "px-2",
      render: (row: UserMetasss) => (
        <div className="flex items-center space-x-2">
          <button
            className="flex w-[118px] h-8 px-3 py-2 justify-center text-center   items-center rounded-[24px] bg-[var(--foundation-blue-light-hover,#DEE8FC)] text-[var(--Foundation-Blue-Normal,#2563EB)] font-outfit text-base font-normal leading-[140%]"
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
      <Table columns={columns} data={memorials} />
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

export default MemorialManagement;
