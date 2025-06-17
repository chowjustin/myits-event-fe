"use client";

import { Dialog, DialogPanel } from "@headlessui/react";
import { Building, X, Clock, Check, XCircle, Users } from "lucide-react";
import Button from "@/components/buttons/Button";
import clsxm from "@/lib/clsxm";
import { BookingRequestWithCapacity } from "@/types/booking-request";
import { parseToWIB } from "@/utils/parseToWib";

interface BookingRequestDetailModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  request: BookingRequestWithCapacity | null;
}

export default function BookingRequestDetailModal({
  isOpen,
  setIsOpen,
  request,
}: BookingRequestDetailModalProps) {
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
                {getStatusBadge(request.status)}
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-3">
                  Detail Permintaan
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Nama Ruangan:</span>
                    <span className="text-gray-900 font-medium">
                      {request.room_name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Kapasitas:</span>
                    <span className="text-gray-900 font-medium">
                      <Users className="inline-block mr-2 h-4 w-4" />
                      {request.room_capacity}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Waktu Permintaan:</span>
                    <span className="text-gray-900 font-medium">
                      {parseToWIB(request.requested_at)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="button" variant="outline" onClick={handleClose}>
                Tutup
              </Button>
            </div>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
