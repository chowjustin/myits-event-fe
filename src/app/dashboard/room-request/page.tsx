"use client";

import { useState } from "react";
import {
  Clock,
  Check,
  XCircle,
  Building,
  Search,
  Filter,
  Users,
} from "lucide-react";
import clsxm from "@/lib/clsxm";
import withAuth from "@/components/hoc/withAuth";
import RoomRequestDetailModal from "./components/BookingDetailModal";
import { BookingRequest } from "@/types/booking-request";
import useGetBookingRequests from "@/app/hooks/booking-request/useGetBookingReq";

export default withAuth(RoomRequestListPage, "departemen");
function RoomRequestListPage() {
  const [selectedRequest, setSelectedRequest] = useState<BookingRequest | null>(
    null,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "pending" | "approved" | "rejected"
  >("all");

  const { data: requestsResponse, isLoading, error } = useGetBookingRequests();

  const requests = requestsResponse?.data || [];

  const handleRequestClick = (request: BookingRequest) => {
    setSelectedRequest(request);
    setIsModalOpen(true);
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

        {/* Request List */}
        {filteredRequests.length === 0 ? (
          <div className="text-center py-12">
            <Building className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm || statusFilter !== "all"
                ? "Tidak ada permintaan yang cocok"
                : "Belum ada permintaan ruangan"}
            </h3>
            <p className="text-gray-600">
              {searchTerm || statusFilter !== "all"
                ? "Coba ubah pencarian atau filter Anda"
                : "Permintaan ruangan baru akan muncul di sini"}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredRequests.map((request) => (
              <div
                key={request.booking_id}
                onClick={() => handleRequestClick(request)}
                className={clsxm(
                  "bg-white rounded-lg p-6 shadow-sm border cursor-pointer transition-all duration-200 hover:shadow-md hover:border-primary-300",
                  request.booking_status === "pending" &&
                    "border-l-4 border-l-yellow-400",
                  request.booking_status === "approved" &&
                    "border-l-4 border-l-green-400",
                  request.booking_status === "rejected" &&
                    "border-l-4 border-l-red-400",
                )}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {request.event_name}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                      <div className="flex items-center gap-1">
                        <Users size={14} />
                        <span>Diminta oleh: {request.requested_by}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Building size={14} />
                        <span>{request.rooms.length} ruangan</span>
                      </div>
                    </div>
                    <div className="mb-3">
                      <p className="text-sm text-gray-600 mb-1">
                        Ruangan yang diminta:
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {request.rooms.slice(0, 3).map((room) => (
                          <span
                            key={room.room_id}
                            className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                          >
                            {room.room_name}
                          </span>
                        ))}
                        {request.rooms.length > 3 && (
                          <span className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                            +{request.rooms.length - 3} lainnya
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      {getStatusBadge(request.booking_status)}
                      {request.booking_status === "pending" && (
                        <span className="text-sm text-primary-600 font-medium">
                          Klik untuk tinjau →
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal */}
        <RoomRequestDetailModal
          isOpen={isModalOpen}
          setIsOpen={setIsModalOpen}
          request={selectedRequest}
        />
      </div>
    </div>
  );
}
