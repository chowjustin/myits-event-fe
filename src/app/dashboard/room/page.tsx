"use client";

import { ColumnDef } from "@tanstack/react-table";
import * as React from "react";
import Table from "@/components/table/Table";
import { DoorOpen, Edit, Trash2 } from "lucide-react";

import withAuth from "@/components/hoc/withAuth";
import Button from "@/components/buttons/Button";
import BreadCrumbs from "@/components/BreadCrumbs";
import ConfirmationDialog from "@/components/ConfirmationDialog";
import useGetAllRooms from "@/app/hooks/room/useGetAllRooms";
import useDeleteRoomMutation from "@/app/hooks/room/useDeleteRoomMutation";
import { Room } from "@/types/room";
import CreateRoomCard from "./components/CreateRoomCard";
import EditRoomDialog from "./components/EditRoomDialog";
const breadCrumbs = [
  { href: "/dashboard", Title: "Dashboard" },
  { href: `/dashboard/room`, Title: "Ruangan" },
];

export default withAuth(RoomPage, "departemen");

function RoomPage() {
  const [roomToDelete, setRoomToDelete] = React.useState<string | null>(null);
  const [roomToEdit, setRoomToEdit] = React.useState<Room | null>(null);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] =
    React.useState<boolean>(false);
  const [isEditDialogOpen, setIsEditDialogOpen] =
    React.useState<boolean>(false);

  const { data: rooms, isLoading: getRoomsLoading, error } = useGetAllRooms();

  const { mutate: deleteRoomMutation, isPending: isDeleteRoomLoading } =
    useDeleteRoomMutation();

  const tableData = React.useMemo(() => {
    if (getRoomsLoading) return [];
    if (!rooms?.data || !Array.isArray(rooms.data)) return [];
    return rooms.data;
  }, [getRoomsLoading, rooms?.data]);

  const handleDeleteRoom = (roomId: string) => {
    setRoomToDelete(roomId);
    setIsConfirmDeleteOpen(true);
  };

  const handleEditRoom = (room: Room) => {
    setRoomToEdit(room);
    setIsEditDialogOpen(true);
  };

  const confirmDelete = () => {
    if (roomToDelete) {
      deleteRoomMutation(roomToDelete);
    }
  };

  const columns = useTableColumns(
    handleDeleteRoom,
    handleEditRoom,
    isDeleteRoomLoading,
  );

  if (error) {
    return (
      <div className="text-center py-8 text-red-600">
        Error loading rooms. Please try again later.
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
          Manajemen Ruangan
        </h1>
      </div>

      <CreateRoomCard />

      <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
        <h2 className="text-2xl font-semibold mb-4 flex items-center gap-3">
          <DoorOpen
            size={24}
            className="text-primary-base max-lg:max-w-[20px]"
          />
          <h2 className="text-2xl max-lg:text-lg font-semibold">
            Daftar Ruangan
          </h2>
        </h2>
        <Table
          className="text-black"
          data={tableData}
          columns={columns}
          withFilter
          withEntries
          withPaginationControl
          isLoading={getRoomsLoading}
          tableClassName="max-h-[32.5vh] overflow-y-auto"
        />
      </div>

      <ConfirmationDialog
        isOpen={isConfirmDeleteOpen}
        setIsOpen={setIsConfirmDeleteOpen}
        message={`Apakah anda yakin ingin menghapus ruangan ini?`}
        onConfirm={confirmDelete}
      />

      <EditRoomDialog
        isOpen={isEditDialogOpen}
        setIsOpen={setIsEditDialogOpen}
        room={roomToEdit}
      />
    </section>
  );
}

const useTableColumns = (
  onDelete: (roomId: string) => void,
  onEdit: (room: Room) => void,
  isDeleteRoomLoading: boolean,
) => {
  return React.useMemo<ColumnDef<Room>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Nama Ruangan",
        cell: ({ row }) => <p>{row.original?.name}</p>,
      },
      {
        accessorKey: "capacity",
        header: "Kapasitas Ruangan",
        cell: ({ row }) => <p>{row.original?.capacity}</p>,
      },
      {
        accessorKey: "department",
        header: "Departemen",
        cell: ({ row }) => <p>{row.original?.department}</p>,
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
                isLoading={isDeleteRoomLoading}
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
    [onDelete, onEdit, isDeleteRoomLoading],
  );
};
