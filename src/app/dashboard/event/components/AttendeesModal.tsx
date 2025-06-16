"use client";

import { Dialog, DialogPanel } from "@headlessui/react";
import { X, Users } from "lucide-react";
import clsxm from "@/lib/clsxm";
import useGetAttendees from "@/app/hooks/event/useGetAttendees";
import { parseToWIB } from "@/utils/parseToWib";
import Button from "@/components/buttons/Button";
import { Attendee } from "@/types/event";

interface AttendeesModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  eventId: string | null;
}

export default function AttendeesModal({
  isOpen,
  setIsOpen,
  eventId,
}: AttendeesModalProps) {
  const {
    data: attendeesResponse,
    isLoading,
    error,
  } = useGetAttendees(eventId!);

  const handleClose = () => {
    setIsOpen(false);
  };

  if (!isOpen || !eventId) return null;

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
              <Users
                size={24}
                className="text-primary-600 mt-1 flex-shrink-0"
              />
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Daftar Peserta
                </h2>
              </div>
            </div>

            {isLoading && <p>Loading...</p>}
            {error && <p className="text-red-500">Error fetching attendees.</p>}

            {attendeesResponse && attendeesResponse.data.length > 0 && (
              <div className="space-y-4">
                {attendeesResponse.data.map(
                  (attendee: Attendee, index: number) => (
                    <div
                      key={attendee.user_id}
                      className="flex items-center justify-between p-3 bg-white rounded-lg border border-blue-100"
                    >
                      <div className="flex items-center gap-2">
                        <span className="flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                          {index + 1}
                        </span>
                        <span className="font-medium text-gray-900">
                          {attendee.user_name}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">
                        Hadir pada: {parseToWIB(attendee.attended_at)}
                      </span>
                    </div>
                  ),
                )}
              </div>
            )}

            {attendeesResponse && attendeesResponse.data.length === 0 && (
              <p>Belum ada peserta yang hadir.</p>
            )}

            <div className="flex justify-end mt-6">
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
