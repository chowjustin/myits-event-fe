"use client";

import { ColumnDef } from "@tanstack/react-table";
import * as React from "react";
import Table from "@/components/table/Table";
import { Edit, ListChecks, Trash2, Users } from "lucide-react";

import withAuth from "@/components/hoc/withAuth";
import Button from "@/components/buttons/Button";
import BreadCrumbs from "@/components/BreadCrumbs";
import ConfirmationDialog from "@/components/ConfirmationDialog";
import { Event as EventType } from "@/types/event";
import useGetEvents, { EventQueryParams } from "@/app/hooks/event/useGetEvents";
import useDeleteEventMutation from "@/app/hooks/event/useDeleteEventMutation";
import CreateEventCard from "./components/CreateEventCard";
import EditEventDialog from "./components/EditEventDialog";
import { parseToWIB } from "@/utils/parseToWib";
import AttendeesModal from "./components/AttendeesModal";
import { Users as AttendeesIcon } from "lucide-react";
import useAuthStore from "@/app/stores/useAuthStore";
import AllAttendeesModal from "./components/AllAttendeesModal";
import InviteesModal from "./components/InviteesModal";
import { on } from "events";

const breadCrumbs = [
  { href: "/dashboard", Title: "Dashboard" },
  { href: `/dashboard/event`, Title: "Event" },
];

const DEFAULT_QUERY_PARAMS: EventQueryParams = {
  page: 1,
  per_page: 10,
};

export default withAuth(Event, "ormawa");

function Event() {
  const [eventToDelete, setEventToDelete] = React.useState<string | null>(null);
  const [eventToEdit, setEventToEdit] = React.useState<EventType | null>(null);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] =
    React.useState<boolean>(false);
  const [isEditDialogOpen, setIsEditDialogOpen] =
    React.useState<boolean>(false);
  const [eventToViewAttendees, setEventToViewAttendees] = React.useState<
    string | null
  >(null);
  const [isAttendeesModalOpen, setIsAttendeesModalOpen] =
    React.useState<boolean>(false);
  const [isInviteesModalOpen, setIsInviteesModalOpen] =
    React.useState<boolean>(false);
  const [isAllAttendeesModalOpen, setIsAllAttendeesModalOpen] =
    React.useState<boolean>(false);
  const [queryParams, setQueryParams] =
    React.useState<EventQueryParams>(DEFAULT_QUERY_PARAMS);

  const { user } = useAuthStore();

  const {
    data: events,
    isLoading: getEventsLoading,
    error,
  } = useGetEvents({ ...queryParams });

  const { mutate: deleteEventMutation, isPending: isDeleteEventLoading } =
    useDeleteEventMutation();

  const tableData = React.useMemo(
    () => (getEventsLoading ? [] : events?.data?.data || []),
    [getEventsLoading, events?.data?.data],
  );

  const totalPages = events?.max_page || 1;

  const handleDeleteEvent = (eventId: string) => {
    setEventToDelete(eventId);
    setIsConfirmDeleteOpen(true);
  };

  const handleEditEvent = (event: EventType) => {
    setEventToEdit(event);
    setIsEditDialogOpen(true);
  };

  const confirmDelete = () => {
    if (eventToDelete) {
      deleteEventMutation(eventToDelete);
    }
  };

  const handleViewAttendees = (eventId: string) => {
    setEventToViewAttendees(eventId);
    setIsAttendeesModalOpen(true);
  };

  const handleViewInvitees = (eventId: string) => {
    setEventToViewAttendees(eventId);
    setIsInviteesModalOpen(true);
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
    handleDeleteEvent,
    handleEditEvent,
    isDeleteEventLoading,
    handleViewAttendees,
    handleViewInvitees,
  );

  if (error) {
    return (
      <div className="text-center py-8 text-red-600">
        Error loading events. Please try again later.
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
          Manajemen Event
        </h1>
      </div>

      <CreateEventCard />

      <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold flex items-center gap-3">
            <Users
              size={24}
              className="text-primary-base max-lg:max-w-[20px]"
            />
            <h2 className="text-2xl max-lg:text-lg font-semibold">
              Event Kamu
            </h2>
          </h2>
          {user?.role === "admin" ? (
            <Button
              variant="outline"
              onClick={() => setIsAllAttendeesModalOpen(true)}
            >
              Lihat Semua Peserta
            </Button>
          ) : (
            <span className="text-base font-medium">
              Event yang kamu buat:{" "}
              {
                tableData.filter((event) => event.created_by === user?.name)
                  .length
              }
            </span>
          )}
        </div>
        <Table
          className="text-black"
          data={
            user?.role === "admin"
              ? tableData
              : tableData.filter((event) => event.created_by === user?.name)
          }
          columns={columns}
          withFilter
          withEntries
          withPaginationControl
          isLoading={getEventsLoading}
          tableClassName="max-h-[32.5vh] overflow-y-auto"
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
        message={`Apakah anda yakin ingin menghapus event ini?`}
        onConfirm={confirmDelete}
      />

      <EditEventDialog
        isOpen={isEditDialogOpen}
        setIsOpen={setIsEditDialogOpen}
        event={eventToEdit}
      />

      <AttendeesModal
        isOpen={isAttendeesModalOpen}
        setIsOpen={setIsAttendeesModalOpen}
        eventId={eventToViewAttendees}
      />

      <InviteesModal
        isOpen={isInviteesModalOpen}
        setIsOpen={setIsInviteesModalOpen}
        eventId={eventToViewAttendees}
      />

      <AllAttendeesModal
        isOpen={isAllAttendeesModalOpen}
        setIsOpen={setIsAllAttendeesModalOpen}
      />
    </section>
  );
}

const useTableColumns = (
  onDelete: (eventId: string) => void,
  onEdit: (event: EventType) => void,
  isDeleteEventLoading: boolean,
  onViewAttendees: (eventId: string) => void,
  onViewInvitees: (eventId: string) => void,
) => {
  return React.useMemo<ColumnDef<any>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Nama Departemen",
        cell: ({ row }) => <p>{row.original?.name}</p>,
      },
      {
        accessorKey: "description",
        header: "Deskripsi",
        cell: ({ row }) => (
          <p className="line-clamp-2">{row.original?.description}</p>
        ),
      },
      {
        accessorKey: "start_time",
        header: "Tanggal Mulai",
        cell: ({ row }) => <p>{parseToWIB(row.original?.start_time)}</p>,
      },
      {
        accessorKey: "end_time",
        header: "Tanggal Selesai",
        cell: ({ row }) => <p>{parseToWIB(row.original?.end_time)}</p>,
      },
      {
        accessorKey: "duration",
        header: "Durasi (menit)",
        cell: ({ row }) => <p>{row.original?.duration}</p>,
      },
      {
        accessorKey: "event_type",
        header: "Tipe Event",
        cell: ({ row }) => <p>{row.original?.event_type}</p>,
      },
      {
        accessorKey: "created_by",
        header: "Dibuat oleh",
        cell: ({ row }) => <p>{row.original?.created_by}</p>,
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
                variant={"blue"}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onViewAttendees(row.original?.id);
                }}
                className="p-2 rounded-full"
              >
                <AttendeesIcon className="h-4 w-4" />
              </Button>
              <Button
                variant={"yellow"}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onViewInvitees(row.original?.id);
                }}
                className="p-2 rounded-full"
              >
                <ListChecks className="h-4 w-4" />
              </Button>
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
                isLoading={isDeleteEventLoading}
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
    [onDelete, onEdit, isDeleteEventLoading, onViewAttendees],
  );
};
