"use client";

import { ColumnDef } from "@tanstack/react-table";
import * as React from "react";
import Table from "@/components/table/Table";
import { DoorOpen } from "lucide-react";

import withAuth from "@/components/hoc/withAuth";
import BreadCrumbs from "@/components/BreadCrumbs";
import { User } from "@/types/user";
import { useGetAllUsers } from "@/app/hooks/auth/useGetAllUsers";
import CreateOrganizationCard from "./components/CreateOrganizationCard";

const breadCrumbs = [
  { href: "/dashboard", Title: "Dashboard" },
  { href: `/dashboard/organization`, Title: "Manajemen Organisasi" },
];

export default withAuth(OrganizationPage, "departemen");

function OrganizationPage() {
  const {
    data: organizations,
    isLoading: getOrganizationsLoading,
    error,
  } = useGetAllUsers({ role: "ormawa" });

  const tableData = React.useMemo(() => {
    if (getOrganizationsLoading) return [];
    if (!organizations?.data || !Array.isArray(organizations.data)) return [];
    return organizations.data;
  }, [getOrganizationsLoading, organizations?.data]);

  const columns = useTableColumns();

  if (error) {
    return (
      <div className="text-center py-8 text-red-600">
        Error loading organizations. Please try again later.
      </div>
    );
  }

  return (
    <section className="space-y-6">
      <div>
        <div className="">
          <BreadCrumbs breadcrumbs={breadCrumbs} />
        </div>
        <h1 className="text-2xl max-lg:text-xl font-semibold">
          Manajemen Organisasi
        </h1>
      </div>

      <CreateOrganizationCard />

      <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
        <h2 className="text-2xl font-semibold mb-4 flex items-center gap-3">
          <DoorOpen
            size={24}
            className="text-primary-base max-lg:max-w-[20px]"
          />
          <h2 className="text-2xl max-lg:text-lg font-semibold">
            Daftar Organisasi
          </h2>
        </h2>
        <Table
          className="text-black"
          data={tableData}
          columns={columns}
          withFilter
          withEntries
          withPaginationControl
          isLoading={getOrganizationsLoading}
          tableClassName="max-h-[32.5vh] overflow-y-auto"
        />
      </div>
    </section>
  );
}

const useTableColumns = () => {
  return React.useMemo<ColumnDef<User>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Nama Organisasi",
        cell: ({ row }) => <p>{row.original?.name}</p>,
      },
      {
        accessorKey: "email",
        header: "Email Organisasi",
        cell: ({ row }) => <p>{row.original?.email}</p>,
      },
    ],
    [],
  );
};
