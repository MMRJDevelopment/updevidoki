/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card/Card";
import { Button } from "@/components/ui/button";
import { Heart, Users, QrCode, DollarSign, ChevronDown } from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Bar, Line } from "react-chartjs-2";
import { useGetcountsQuery } from "@/redux/features/adminDashbord/adminDashboardApi";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function AdminOverview() {
  const { data, isLoading } = useGetcountsQuery({});
  const countsData = data?.data;
  // User Engagement Bar Chart Data
  //   const userEngagementData = {
  //     labels: ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sep"],
  //     datasets: [
  //       {
  //         data: [45, 65, 55, 70, 85, 90, 95, 100, 110],
  //         backgroundColor: "#3B82F6",
  //         borderRadius: 4,
  //         barThickness: 20,
  //       },
  //     ],
  //   };

  //   const userEngagementOptions = {
  //     responsive: true,
  //     maintainAspectRatio: false,
  //     plugins: {
  //       legend: {
  //         display: false,
  //       },
  //       tooltip: {
  //         backgroundColor: "#1F2937",
  //         titleColor: "#F9FAFB",
  //         bodyColor: "#F9FAFB",
  //         borderColor: "#374151",
  //         borderWidth: 1,
  //       },
  //     },
  //     scales: {
  //       x: {
  //         grid: {
  //           display: false,
  //         },
  //         border: {
  //           display: false,
  //         },
  //         ticks: {
  //           color: "#6B7280",
  //           font: {
  //             size: 12,
  //           },
  //         },
  //       },
  //       y: {
  //         display: false,
  //       },
  //     },
  //   };

  // Memorial Created Over Time Area Chart Data
  //   const memorialData = {
  //     labels: ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sep"],
  //     datasets: [
  //       {
  //         data: [40, 65, 45, 80, 60, 85, 50, 90, 75],
  //         fill: true,
  //         backgroundColor: "rgba(59, 130, 246, 0.25)",
  //         borderColor: "#3B82F6",
  //         borderWidth: 2,
  //         tension: 0.4,
  //         pointRadius: 0,
  //         pointHoverRadius: 6,
  //       },
  //     ],
  //   };

  //   const memorialOptions = {
  //     responsive: true,
  //     maintainAspectRatio: false,
  //     plugins: {
  //       legend: {
  //         display: false,
  //       },
  //       tooltip: {
  //         backgroundColor: "#1F2937",
  //         titleColor: "#F9FAFB",
  //         bodyColor: "#F9FAFB",
  //         borderColor: "#374151",
  //         borderWidth: 1,
  //       },
  //     },
  //     scales: {
  //       x: {
  //         grid: {
  //           display: false,
  //         },
  //         border: {
  //           display: false,
  //         },
  //         ticks: {
  //           color: "#6B7280",
  //           font: {
  //             size: 12,
  //           },
  //         },
  //       },
  //       y: {
  //         display: false,
  //       },
  //     },
  //   };

  // Total Earning Area Chart Data
  const earningData = {
    labels: Array.from({ length: 31 }, (_, i) => (i + 1).toString()),
    datasets: [
      {
        data: [
          12000, 11500, 13000, 12800, 14000, 13500, 15000, 14200, 16000, 15800,
          17000, 16200, 15000, 14800, 16500, 15900, 17200, 16800, 15500, 16200,
          14900, 15800, 16400, 15200, 14000, 15600, 16800, 17000, 16500, 17200,
          16900,
        ],
        fill: true,
        backgroundColor: "rgba(59, 130, 246, 0.2)",
        borderColor: "#3B82F6",
        borderWidth: 2,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 6,
      },
    ],
  };

  const earningOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "#1F2937",
        titleColor: "#F9FAFB",
        bodyColor: "#F9FAFB",
        borderColor: "#374151",
        borderWidth: 1,
        callbacks: {
          label: (context: any) => `$${context.parsed.y.toLocaleString()}`,
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        border: {
          display: false,
        },
        ticks: {
          color: "#6B7280",
          font: {
            size: 12,
          },
          maxTicksLimit: 10,
        },
      },
      y: {
        grid: {
          color: "#F3F4F6",
          drawBorder: false,
        },
        border: {
          display: false,
        },
        ticks: {
          color: "#6B7280",
          font: {
            size: 12,
          },
          callback: (value: any) => value.toLocaleString(),
        },
        min: 8000,
        max: 18000,
      },
    },
  };

  return (
    <div className=" space-y-6">
      {/* Header */}
      <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Memory
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {countsData?.memoryCount}
                </p>
              </div>
              <div className="h-12 w-12 bg-blue-50 rounded-lg flex items-center justify-center">
                <Heart className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Totale Users
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {countsData?.userCount}
                </p>
              </div>
              <div className="h-12 w-12 bg-blue-50 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Orders
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {countsData?.orderCount}
                </p>
              </div>
              <div className="h-12 w-12 bg-blue-50 rounded-lg flex items-center justify-center">
                <QrCode className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Revenue
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {countsData?.paymentCount}
                </p>
              </div>
              <div className="h-12 w-12 bg-blue-50 rounded-lg flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Engagement Chart */}
        {/* <Card className="bg-white shadow-sm">
					<CardHeader className="pb-4">
						<div className="space-y-1">
							<CardTitle className="text-lg font-semibold text-gray-900">
								User Engagement
							</CardTitle>
							<p className="text-lg font-semibold text-gray-900">
								+10% from last Month
							</p>
							<p className="text-sm text-blue-600">Last 6 Months +15%</p>
						</div>
					</CardHeader>
					<CardContent>
						<div className="h-48">
							<Bar data={userEngagementData} options={userEngagementOptions} />
						</div>
					</CardContent>
				</Card> */}

        {/* Memorial Created Over Time Chart */}
        {/* <Card className="bg-white shadow-sm">
					<CardHeader className="pb-4">
						<div className="space-y-1">
							<CardTitle className="text-lg font-semibold text-gray-900">
								Memorial Created Over Time
							</CardTitle>
							<p className="text-lg font-semibold text-gray-900">
								+15% from last Month
							</p>
							<p className="text-sm text-blue-600">Last 6 Months +15%</p>
						</div>
					</CardHeader>
					<CardContent>
						<div className="h-48">
							<Line data={memorialData} options={memorialOptions} />
						</div>
					</CardContent>
				</Card> */}
      </div>

      {/* Total Earning Chart */}
      <Card className="bg-white shadow-sm h-full">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-gray-900">
              Total Earning
            </CardTitle>
            <Button variant="outline" size="sm" className="h-8 bg-transparent">
              Month
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-full">
            <Line data={earningData} options={earningOptions} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
