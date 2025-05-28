"use client";

import withAuth from "@/components/hoc/withAuth";

export default withAuth(Dashboard, "user");

function Dashboard() {
  return (
    <main>
      <div className="text-justify h-screen">
        <h1 className="text-2xl font-bold mb-4 ">Dashboard</h1>
        <p>
          Welcome to the dashboard! Here you can manage your posts, view
          statistics, and more.
        </p>
        {/* Add more dashboard components here */}
      </div>
    </main>
  );
}
