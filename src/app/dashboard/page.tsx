"use client";

import withAuth from "@/components/hoc/withAuth";

export default withAuth(Dashboard, "user");

function Dashboard() {
  return (
    <main>
      <div className="text-justify h-screen">
        <h1 className="text-2xl font-bold mb-4 ">Dashboard</h1>
        <p>Selamat datang di myITS Event!</p>
      </div>
    </main>
  );
}
