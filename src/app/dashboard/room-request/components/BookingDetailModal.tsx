"use client";

import { Dialog, DialogPanel } from "@headlessui/react";
import { Building, Clock, X, Check, XCircle } from "lucide-react";
import Button from "@/components/buttons/Button";
import clsxm from "@/lib/clsxm";
import useUpdateBookingRequest from "@/app/hooks/booking-request/useUpdateBookingReq";
import toast from "react-hot-toast";

interface Room {
  room_id: string;
  room_name: string;
}

interface BookingRequest {
  booking_id: string;
  booking_status: "pending" | "approved" | "rejected";
  event_id: string;
  event_name: string;
  requested_by: string;
  rooms: Room[];
}

interface RoomRequestDetailModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  request: BookingRequest | null;
}

export default function RoomRequestDetailModal({
  isOpen,
  setIsOpen,
  request,
}: RoomRequestDetailModalProps) {
  const { mutate: acceptRequest, isPending: isAccepting } =
    useUpdateBookingRequest({
      bookingId: request?.booking_id!,
      action: "approve",
    });
  const { mutate: rejectRequest, isPending: isRejecting } =
    useUpdateBookingRequest({
      bookingId: request?.booking_id!,
      action: "reject",
    });

  const handleAccept = () => {
    if (!request) return;
    acceptRequest(undefined, {
      onSuccess: () => {
        toast.success("Booking request berhasil diterima");
        setIsOpen(false);
      },
    });
  };

  const handleReject = () => {
    if (!request) return;
    rejectRequest(undefined, {
      onSuccess: () => {
        toast.success("Booking request berhasil ditolak");
        setIsOpen(false);
      },
    });
  };

  const handleClose = () => {
    setIsOpen(false);
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

  if (!request) return null;

  const isDecided = request.booking_status !== "pending";

  return (
    <Dialog open={isOpen} onClose={handleClose} className="relative z-50">
      <div className="fixed inset-0 flex items-center justify-center bg-black/50 px-4">
        <DialogPanel
          className={clsxm(
            "bg-white relative shadow-xl text-gray-900 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto",
          )}
        >
          <button
            onClick={handleClose}
            className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X strokeWidth={2.5} size={20} />
          </button>

          <div>
            <div className="flex items-start gap-3 mb-6 pr-8">
              <Building
                size={24}
                className="text-primary-600 mt-1 flex-shrink-0"
              />
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  {request.event_name}
                </h2>
                {getStatusBadge(request.booking_status)}
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-3">
                  Detail Permintaan
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Event ID:</span>
                    <span className="text-gray-900 font-medium font-mono text-xs">
                      {request.event_id}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Diminta oleh:</span>
                    <span className="text-gray-900 font-medium">
                      {request.requested_by}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className="text-gray-900 font-medium capitalize">
                      {request.booking_status === "pending"
                        ? "Menunggu"
                        : request.booking_status === "approved"
                          ? "Disetujui"
                          : "Ditolak"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Jumlah ruangan:</span>
                    <span className="text-gray-900 font-medium">
                      {request.rooms.length} ruangan
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-medium text-blue-900 mb-3">
                  Ruangan yang Diminta
                </h3>
                <div className="space-y-2">
                  {request.rooms.map((room, index) => (
                    <div
                      key={room.room_id}
                      className="flex items-center justify-between p-3 bg-white rounded-lg border border-blue-100"
                    >
                      <div className="flex items-center gap-2">
                        <span className="flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                          {index + 1}
                        </span>
                        <span className="font-medium text-gray-900">
                          {room.room_name}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500 font-mono">
                        {room.room_id.slice(0, 8)}...
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div
                className={clsxm(
                  "rounded-lg p-4 border",
                  request.booking_status === "pending" &&
                    "bg-yellow-50 border-yellow-200",
                  request.booking_status === "approved" &&
                    "bg-green-50 border-green-200",
                  request.booking_status === "rejected" &&
                    "bg-red-50 border-red-200",
                )}
              >
                <h3
                  className={clsxm(
                    "font-medium mb-3",
                    request.booking_status === "pending" && "text-yellow-900",
                    request.booking_status === "approved" && "text-green-800",
                    request.booking_status === "rejected" && "text-red-800",
                  )}
                >
                  Tindakan Administrator
                </h3>
                <p
                  className={clsxm(
                    "text-sm mb-4",
                    request.booking_status === "pending" && "text-yellow-800",
                    request.booking_status === "approved" && "text-green-800",
                    request.booking_status === "rejected" && "text-red-800",
                  )}
                >
                  {isDecided
                    ? `Permintaan ini telah ${request.booking_status === "approved" ? "disetujui" : "ditolak"}.`
                    : "Silakan tinjau permintaan ruangan ini dan berikan keputusan:"}
                </p>

                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="primary"
                    onClick={handleAccept}
                    disabled={isAccepting || isRejecting}
                    className="flex-1 flex items-center justify-center gap-2"
                  >
                    <Check size={16} />
                    {isAccepting ? "Memproses..." : "Setujui"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleReject}
                    disabled={isAccepting || isRejecting}
                    className="flex-1 flex items-center justify-center gap-2 border-red-300 text-red-700 hover:bg-red-50"
                  >
                    <XCircle size={16} />
                    {isRejecting ? "Memproses..." : "Tolak"}
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isAccepting || isRejecting}
              >
                Tutup
              </Button>
            </div>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
