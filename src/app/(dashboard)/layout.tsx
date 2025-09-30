import Sidebar from "@/components/pages/dashboardLayout/sidebar";
import TopNav from "@/components/pages/dashboardLayout/top-nav";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
		<div className={`flex h-screen `}>
			<Sidebar />
			<div className="w-full flex flex-1 flex-col">
				<header className="h-16">
					<TopNav />
				</header>
				<main className="flex-1 overflow-auto h-auto w-full p-3 xl:p-6 bg-[#F5F7FB]">
					{children}
				</main>
			</div>
		</div>
	);
}
