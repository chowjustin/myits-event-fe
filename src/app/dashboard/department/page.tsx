"use client";

import { ColumnDef } from "@tanstack/react-table";
import * as React from "react";
import Table from "@/components/table/Table";
import { Edit, Trash2, Users } from "lucide-react";

import withAuth from "@/components/hoc/withAuth";
import Button from "@/components/buttons/Button";
import BreadCrumbs from "@/components/BreadCrumbs";
import ConfirmationDialog from "@/components/ConfirmationDialog";
import CreateDepartmentCard from "@/app/dashboard/department/components/CreateDepartmentCard";
import useGetDepartments, {
  DepartmentQueryParams,
} from "@/app/hooks/department/useGetDepartments";
import useDeleteDepartmentMutation from "@/app/hooks/department/useDeleteDepartmentMutation";
import EditDepartmentDialog from "@/app/dashboard/department/components/EditDepartmentDialog";
import { Department as DepartmentType } from "@/types/department";

const breadCrumbs = [
  { href: "/dashboard", Title: "Dashboard" },
  { href: `/dashboard/department`, Title: "Departemen" },
];

const DEFAULT_QUERY_PARAMS: DepartmentQueryParams = {
  page: 1,
  per_page: 10,
};

export default withAuth(Department, "departemen");

function Department() {
  const [departmentToDelete, setDepartmentToDelete] = React.useState<
    string | null
  >(null);
  const [departmentToEdit, setDepartmentToEdit] =
    React.useState<DepartmentType | null>(null);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] =
    React.useState<boolean>(false);
  const [isEditDialogOpen, setIsEditDialogOpen] =
    React.useState<boolean>(false);
  const [queryParams, setQueryParams] =
    React.useState<DepartmentQueryParams>(DEFAULT_QUERY_PARAMS);

  const {
    data: departments,
    isLoading: getDepartmentsLoading,
    error,
  } = useGetDepartments({ ...queryParams });

  const {
    mutate: deleteDepartmentMutation,
    isPending: isDeleteDepartmentLoading,
  } = useDeleteDepartmentMutation();

  const tableData = React.useMemo(
    () => (getDepartmentsLoading ? [] : departments?.data || []),
    [getDepartmentsLoading, departments?.data],
  );

  const totalPages = departments?.meta?.max_page || 1;

  const handleDeleteDepartment = (departmentId: string) => {
    setDepartmentToDelete(departmentId);
    setIsConfirmDeleteOpen(true);
  };

  const handleEditDepartment = (department: DepartmentType) => {
    setDepartmentToEdit(department);
    setIsEditDialogOpen(true);
  };

  const confirmDelete = () => {
    if (departmentToDelete) {
      deleteDepartmentMutation(departmentToDelete);
    }
  };

  const handleTableParamsChange = (
    page: number,
    pageSize: number,
    orderBy?: string,
    isAsc?: boolean,
  ) => {
    setQueryParams((prev) => ({
      ...prev,
      page: page,
      limit: pageSize,
      order_by: orderBy || "name",
      asc: isAsc === undefined ? true : isAsc,
    }));
  };

  const columns = useTableColumns(
    handleDeleteDepartment,
    handleEditDepartment,
    isDeleteDepartmentLoading,
  );

  if (error) {
    return (
      <div className="text-center py-8 text-red-600">
        Error loading departments. Please try again later.
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
          Manajemen Departemen
        </h1>
      </div>

      <CreateDepartmentCard />

      <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
        <h2 className="text-2xl font-semibold mb-4 flex items-center gap-3">
          <Users size={24} className="text-primary-base max-lg:max-w-[20px]" />
          <h2 className="text-2xl max-lg:text-lg font-semibold">
            Daftar Departemen
          </h2>
        </h2>
        <Table
          className="text-black"
          data={tableData}
          columns={columns}
          withFilter
          withEntries
          withPaginationControl
          isLoading={getDepartmentsLoading}
          onTableParamsChange={handleTableParamsChange}
          apiIntegration={{
            enabled: true,
            currentPage: queryParams.page,
            pageSize: queryParams.per_page,
            totalPages: totalPages,
          }}
        />
      </div>

      <ConfirmationDialog
        isOpen={isConfirmDeleteOpen}
        setIsOpen={setIsConfirmDeleteOpen}
        message={`Apakah anda yakin ingin menghapus departemen ini?`}
        onConfirm={confirmDelete}
      />

      <EditDepartmentDialog
        isOpen={isEditDialogOpen}
        setIsOpen={setIsEditDialogOpen}
        department={departmentToEdit}
      />
    </section>
  );
}

const useTableColumns = (
  onDelete: (departmentId: string) => void,
  onEdit: (department: DepartmentType) => void,
  isDeleteDepartmentLoading: boolean,
) => {
  return React.useMemo<ColumnDef<any>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Nama Departemen",
        cell: ({ row }) => <p>{row.original?.name}</p>,
      },
      {
        accessorKey: "faculty",
        header: "Fakultas",
        cell: ({ row }) => <p>{row.original?.faculty}</p>,
      },
      {
        accessorKey: "email",
        header: "Akun Departemen",
        cell: ({ row }) => <p>{row.original?.email}</p>,
      },
      {
        id: "actions",
        header: "Actions",
        accessorFn: () => null,
        enableSorting: false,
        cell: ({ row }) => {
          return (
            <div className="flex gap-2 justify-center">
              <Button
                variant={"outline"}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onEdit(row.original);
                }}
                className="p-2 rounded-full"
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant={"red"}
                isLoading={isDeleteDepartmentLoading}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onDelete(row.original?.id);
                }}
                className="p-2 rounded-full"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          );
        },
      },
    ],
    [onDelete, onEdit, isDeleteDepartmentLoading],
  );
};
