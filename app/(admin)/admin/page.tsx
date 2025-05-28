import DashboardPageClient from "@/components/admin/dashboard-page";
import { fetchDashboardData } from "@/server actions/actions";
import React from "react";

// Sample data for the dashboard

// const dashboardData = {
//   totalCars: 127,
//   totalValue: 2850000,
//   newListings: 8,
//   soldThisMonth: 15,
//   recentCars: [
//     { id: 1, make: "BMW", model: "X5", year: 2023, price: 65000, status: "available" },
//     { id: 2, make: "Mercedes", model: "C-Class", year: 2022, price: 45000, status: "sold" },
//     { id: 3, make: "Audi", model: "A4", year: 2023, price: 52000, status: "available" },
//     { id: 4, make: "Tesla", model: "Model 3", year: 2023, price: 48000, status: "pending" },
//   ],
// }

const DashboardPage = async () => {
  const dashboardData = await fetchDashboardData();
  return <DashboardPageClient dashboardData={dashboardData} />;
};

export default DashboardPage;
