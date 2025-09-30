import { TransactionMeta } from "@/components/pages/adminDashboard/PaymentManagement";
import { UserMeta } from "@/components/pages/adminDashboard/UserManagement";
import { Skeleton } from "antd";

export interface SubscriptionData {
	id?: number | string;
	username?: string;
	email?: string;
	days?: number;
	invoiceCode?: string;
	details?: string;
	status?: string;
	actionts?: string;
	action?: string;
}

interface Column<T = unknown> {
	header: string;
	accessor: string;
	render?: (data: T) => React.ReactNode;
	className?: string;
}

interface TableProps<T extends SubscriptionData | UserMeta | TransactionMeta> {
	columns: Column<T>[];
	data: T[];
	emptyMessage?: string;
	className?: string;
	isLoading?: boolean;
	onAction?: (action: string, id: string) => void;
}

export const Table = <T extends SubscriptionData | UserMeta | TransactionMeta>({
	columns,
	data,
	emptyMessage,
	className = "",
	isLoading,
}: TableProps<T>) => {
	return (
		<div
			className={`overflow-x-auto border-[1px] border-[#E6EFFF] rounded-[8px] bg-white ${className}`}
		>
			<table className="min-w-full divide-y divide-[#23232133]/20">
				<thead>
					<tr>
						{columns.map((column, index) => (
							<th
								key={column.accessor}
								className={`px-1 xl:px-6 py-3 bg-[#DEE8FC] text-left text-base font-normal font-inter text-[#494949] tracking-wider ${
									index === 0 ? "pl-4" : ""
								} ${column.className || ""}`}
							>
								{column.header}
							</th>
						))}
					</tr>
				</thead>
				<tbody className="divide-y divide-[#23232133]/20 text-black  font-inter font-normal text-base">
					{isLoading && data?.length === 0 ? (
						<tr>
							<td
								colSpan={columns.length}
								className="px-1 xl:px-6 py-5 text-center"
							>
								<Skeleton active avatar paragraph={{ rows: 12 }} />
							</td>
						</tr>
					) : data?.length > 0 ? (
						data?.map((row) => (
							<tr key={row?.id}>
								{columns?.map((column, colIndex) => (
									<td
										key={`${row.id}-${column.accessor}`}
										className={`px-1 xl:px-6 py-4 whitespace-nowrap xl:mx-6 mx-2 ${
											colIndex === 0 ? "pl-4" : ""
										} ${column.className || ""}`}
									>
										{column.render
											? column.render(row)
											: ((row as Record<string, unknown>)[
													column.accessor
											  ] as React.ReactNode)}
									</td>
								))}
							</tr>
						))
					) : (
						<tr>
							<td
								colSpan={columns.length}
								className="px-1 xl:px-6 py-4 text-center text-sm text-gray-500"
							>
								{emptyMessage}
							</td>
						</tr>
					)}
				</tbody>
			</table>
		</div>
	);
};
