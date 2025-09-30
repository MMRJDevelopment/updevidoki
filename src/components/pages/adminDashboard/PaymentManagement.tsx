"use client";
import { Pagination } from "@/components/ui/pagination/Pagination";
import { Table } from "@/components/ui/Table/Table";
import { useGetAllPaymentsQuery } from "@/redux/features/adminDashbord/adminDashboardApi";
// import Image from "next/image";
import React, { useState } from "react";
import { IoSearch } from "react-icons/io5";

export type TransactionMeta = {
  id: string;
  name: string;
  image: string;
  date: string; // YYYY-MM-DD
  paymentMethod: string; // e.g., "Credit Card", "PayPal"
  price: string; // e.g., "$120.00"
  user: { email: string };
  status: "COMPLETED" | "PENDING" | "FAILED";
  createdAt: string;
  amount: number;
};

const PaymentManagement = () => {
  const [search, setSearch] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const ITEMS_PER_PAGE = 5;
  const { data } = useGetAllPaymentsQuery({
    page: currentPage,
    limit: ITEMS_PER_PAGE,
    searchTerm: search,
  });

  const totalItem = data?.meta?.totalItems || 0;
  const totalPage = data?.meta?.totalPages || 0;
  const transactions = data?.data?.data || [];
  console.log(data?.data.data, "transactions");

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  const columns = [
    // {
    //   header: "User",
    //   accessor: "user",
    //   className: "pl-4 pr-12",
    //   render: (transactions: TransactionMeta) => (
    //     <div className="flex items-center space-x-3">
    //       <Image
    //         src={transactions.image}
    //         alt={transactions.name}
    //         width={32}
    //         height={32}
    //         className="w-8 h-8 rounded-full object-cover"
    //       />
    //       <span>{transactions.name}</span>
    //     </div>
    //   ),
    // },
    {
      header: "Email",
      accessor: "email",
      className: "pl-4 pr-12",
      render: (row: TransactionMeta) => <span>{row.user.email}</span>,
    },
    {
      header: "Date",
      accessor: "date",
      className: "px-12",
      render: (row: TransactionMeta) => (
        <span>{new Date(row.createdAt).toLocaleDateString()}</span>
      ),
    },
    {
      header: "Payment Status",
      accessor: "status",
      className: "px-12",
      render: (row: TransactionMeta) => (
		<span className="capitalize">{row.status}</span>
      ),
    },
    {
      header: "Price",
      accessor: "amount",
      className: "px-12",
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
          className="text-[#8C8C8C] outline-none rounded-full border-[#BFBFBF] border-[1px] cursor-pointer font-dm text-sm font-normal leading-[20px] rounded-[8px] bg-white shadow-[0px_4px_50px_0px_rgba(0,_0,_0,_0.08)] flex h-[44px] px-[12px] py-[10px] pl-[16px] justify-between items-end flex-1 focus:ring-2 focus:ring-blue-500 focus:outline-none focus:border-blue-500"
        />
        <IoSearch className="absolute right-[12px] top-[50%] text-[20px] transform -translate-y-[50%] text-[#8C8C8C]" />
      </div>
      <Table columns={columns} data={transactions} />

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

export default PaymentManagement;
