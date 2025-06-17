"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import {
  Clock,
  Check,
  XCircle,
  Building,
  Search,
  Filter,
  Users,
  Trash2,
} from "lucide-react";
import clsxm from "@/lib/clsxm";
import withAuth from "@/components/hoc/withAuth";
import RoomRequestDetailModal from "./components/BookingDetailModal";
import { BookingRequest } from "@/types/booking-request";
import useGetBookingRequests from "@/app/hooks/booking-request/useGetBookingReq";
import { ColumnDef } from "@tanstack/react-table";
import Table from "@/components/table/Table";
import Button from "@/components/buttons/Button";
import ConfirmationDialog from "@/components/ConfirmationDialog";
import useAuthStore from "@/app/stores/useAuthStore";
import api from "@/lib/api";
import toast from "react-hot-toast";
import { Edit } from "lucide-react";

export default withAuth(RoomRequestListPage, "departemen");
function RoomRequestListPage() {
  const [selectedRequest, setSelectedRequest] = useState<BookingRequest | null>(
    null,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmDeleteDialogOpen, setIsConfirmDeleteDialogOpen] =
    useState(false);
  const [requestToDelete, setRequestToDelete] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "pending" | "approved" | "rejected"
  >("all");
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  const { data: requestsResponse, isLoading, error } = useGetBookingRequests();

  const { mutate: deleteBookingRequestMutation, isPending: isDeleteLoading } =
    useMutation({
      mutationFn: async (bookingId: string) => {
        return await api.delete(`/booking-request/${bookingId}`);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["booking-requests"] });
        toast.success("Booking request berhasil dihapus");
        setIsConfirmDeleteDialogOpen(false);
      },
      onError: (error: any) => {
        const errorMessage =
          error?.response?.data?.error || "Gagal menghapus booking request";
        toast.error(errorMessage);
        setIsConfirmDeleteDialogOpen(false);
      },
    });

  const requests = requestsResponse?.data || [];

  const handleRequestClick = (request: BookingRequest) => {
    setSelectedRequest(request);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (bookingId: string) => {
    setRequestToDelete(bookingId);
    setIsConfirmDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (requestToDelete) {
      deleteBookingRequestMutation(requestToDelete);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock size={12} />
            Menunggu
          </span>
        );
      case "approved":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <Check size={12} />
            Disetujui
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <XCircle size={12} />
            Ditolak
          </span>
        );
      default:
        return null;
    }
  };

  const filteredRequests = requests.filter((request) => {
    const matchesSearch =
      request.event_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.requested_by.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || request.booking_status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const columns: ColumnDef<BookingRequest>[] = [
    {
      accessorKey: "event_name",
      header: "Nama Event",
    },
    {
      accessorKey: "requested_by",
      header: "Dipesan oleh",
    },
    {
      accessorKey: "booking_status",
      header: "Status",
      cell: ({ row }) => getStatusBadge(row.original.booking_status),
    },
    {
      accessorKey: "rooms",
      header: "Ruangan",
      cell: ({ row }) => (
        <div className="flex flex-wrap gap-1">
          {row.original.rooms.slice(0, 2).map((room) => (
            <span
              key={room.room_id}
              className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
            >
              {room.room_name}
            </span>
          ))}
          {row.original.rooms.length > 2 && (
            <span className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
              +{row.original.rooms.length - 2} lainnya
            </span>
          )}
        </div>
      ),
    },
    {
      id: "actions",
      header: "Aksi",
      cell: ({ row }) => (
        <div className="flex gap-2 justify-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleRequestClick(row.original)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          {user?.role === "admin" && (
            <Button
              variant="red"
              size="sm"
              isLoading={
                isDeleteLoading && requestToDelete === row.original.booking_id
              }
              onClick={() => handleDeleteClick(row.original.booking_id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      ),
    },
  ];

  const pendingCount = requests.filter(
    (req) => req.booking_status === "pending",
  ).length;
  const approvedCount = requests.filter(
    (req) => req.booking_status === "approved",
  ).length;
  const rejectedCount = requests.filter(
    (req) => req.booking_status === "rejected",
  ).length;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat permintaan ruangan...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600">Gagal memuat permintaan ruangan</p>
        </div>
      </div>
    );
  }

  return (
    <div className="">
      <div className="mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Building className="h-8 w-8 text-primary-600" />
            <h1 className="text-3xl font-bold text-gray-900">
              Permintaan Ruangan
            </h1>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg p-4 shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {requests.length}
                  </p>
                </div>
                <Building className="h-8 w-8 text-gray-400" />
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Menunggu</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {pendingCount}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-yellow-400" />
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Disetujui</p>
                  <p className="text-2xl font-bold text-green-600">
                    {approvedCount}
                  </p>
                </div>
                <Check className="h-8 w-8 text-green-400" />
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Ditolak</p>
                  <p className="text-2xl font-bold text-red-600">
                    {rejectedCount}
                  </p>
                </div>
                <XCircle className="h-8 w-8 text-red-400" />
              </div>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Cari event atau organisasi..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none bg-white"
              >
                <option value="all">Semua Status</option>
                <option value="pending">Menunggu</option>
                <option value="approved">Disetujui</option>
                <option value="rejected">Ditolak</option>
              </select>
            </div>
          </div>
        </div>
        <Table
          columns={columns}
          data={filteredRequests}
          withPaginationControl
          withFilter
        />

        {/* Modal */}
        <RoomRequestDetailModal
          isOpen={isModalOpen}
          setIsOpen={setIsModalOpen}
          request={selectedRequest}
        />
        <ConfirmationDialog
          isOpen={isConfirmDeleteDialogOpen}
          setIsOpen={setIsConfirmDeleteDialogOpen}
          message="Apakah Anda yakin ingin menghapus permintaan booking ini?"
          onConfirm={confirmDelete}
        />
      </div>
    </div>
  );
}
