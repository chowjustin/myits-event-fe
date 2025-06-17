"use client";

import { Dialog, DialogPanel } from "@headlessui/react";
import { X, Users } from "lucide-react";
import clsxm from "@/lib/clsxm";
import Table from "@/components/table/Table";
import { ColumnDef } from "@tanstack/react-table";
import * as React from "react";
import useGetAllAttendees, {
  AllAttendeesQueryParams,
} from "@/app/hooks/event/useGetAllAttendees";
import { Attendee } from "@/types/event";
import { parseToWIB } from "@/utils/parseToWib";
import Button from "@/components/buttons/Button";

interface AllAttendeesModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const DEFAULT_QUERY_PARAMS: AllAttendeesQueryParams = {
  page: 1,
  per_page: 10,
};

export default function AllAttendeesModal({
  isOpen,
  setIsOpen,
}: AllAttendeesModalProps) {
  const [queryParams, setQueryParams] =
    React.useState<AllAttendeesQueryParams>(DEFAULT_QUERY_PARAMS);

  const { data: response, isLoading } = useGetAllAttendees(queryParams);

  const tableData = React.useMemo(() => response?.data || [], [response]);
  const totalPages = response?.meta?.max_page || 1;

  const handleTableParamsChange = (page: number, pageSize: number) => {
    setQueryParams({ page, per_page: pageSize });
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const columns = useTableColumns();

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onClose={handleClose} className="relative z-50">
      <div className="fixed inset-0 flex items-center justify-center bg-black/50 px-4">
        <DialogPanel
          className={clsxm(
            "bg-white relative shadow-xl text-gray-900 rounded-lg p-6 w-full max-w-4xl max-h-[90vh] flex flex-col",
          )}
        >
          <button
            onClick={handleClose}
            className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X strokeWidth={2.5} size={20} />
          </button>
          <div className="flex items-start gap-3 mb-6 pr-8">
            <Users size={24} className="text-primary-600 mt-1 flex-shrink-0" />
            <h2 className="text-xl font-semibold text-gray-900">
              Semua Peserta Event
            </h2>
          </div>
          <div className="overflow-y-auto">
            <Table
              className="text-black"
              data={tableData}
              columns={columns}
              withFilter
              withEntries
              withPaginationControl
              isLoading={isLoading}
              onTableParamsChange={handleTableParamsChange}
              apiIntegration={{
                enabled: true,
                currentPage: queryParams.page,
                pageSize: queryParams.per_page,
                totalPages: totalPages,
              }}
            />
          </div>
          <div className="flex justify-end mt-6 pt-4 border-t">
            <Button type="button" variant="outline" onClick={handleClose}>
              Tutup
            </Button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}

const useTableColumns = () => {
  return React.useMemo<ColumnDef<Attendee>[]>(
    () => [
      {
        accessorKey: "user_name",
        header: "Nama Peserta",
      },
      {
        accessorKey: "event_name",
        header: "Nama Event",
      },
      {
        accessorKey: "attended_at",
        header: "Waktu Hadir",
        cell: ({ row }) => <p>{parseToWIB(row.original.attended_at)}</p>,
      },
    ],
    [],
  );
};
