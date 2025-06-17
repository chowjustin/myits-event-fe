"use client";

import { Dialog, DialogPanel } from "@headlessui/react";
import { X, Users, Mail, CheckCircle, Clock, XCircle } from "lucide-react";
import clsxm from "@/lib/clsxm";
import { parseToWIB } from "@/utils/parseToWib";
import Button from "@/components/buttons/Button";
import useGetInviteesByEventID from "@/app/hooks/invitation/useGetInviteesByEventID";

interface Invitation {
  id: string;
  event_name: string;
  name: string;
  invited_at: string;
  rsvp_status: "accepted" | "pending" | "declined";
}

interface InviteesModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  eventId: string | null;
}

const statusStyles = {
  accepted: "bg-green-100 text-green-800",
  pending: "bg-yellow-100 text-yellow-800",
  declined: "bg-red-100 text-red-800",
};

const statusIcons = {
  accepted: <CheckCircle size={16} className="text-green-600" />,
  pending: <Clock size={16} className="text-yellow-600" />,
  declined: <XCircle size={16} className="text-red-600" />,
};

export default function InviteesModal({
  isOpen,
  setIsOpen,
  eventId,
}: InviteesModalProps) {
  const {
    data: inviteesResponse,
    isLoading,
    error,
  } = useGetInviteesByEventID(eventId!);

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
                <h2 className="text-xl font-semibold text-gray-900">
                  Daftar Undangan
                </h2>
                {inviteesResponse?.data?.[0] && (
                  <p className="text-sm text-gray-600 mt-1">
                    Untuk acara: {inviteesResponse.data[0].event_name}
                  </p>
                )}
              </div>
            </div>

            {isLoading && <p>Loading...</p>}
            {error && <p className="text-red-500">Error fetching invitees.</p>}

            {inviteesResponse && inviteesResponse.data.length > 0 && (
              <div className="space-y-4">
                {(inviteesResponse.data as unknown as Invitation[]).map(
                  (invitation, index) => (
                    <div
                      key={`${invitation.id}-${index}`}
                      className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                    >
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-lg text-gray-800">
                          {invitation.name}
                        </p>
                        <div
                          className={clsxm(
                            "flex items-center gap-2 px-3 py-1 text-xs font-medium rounded-full",
                            statusStyles[invitation.rsvp_status],
                          )}
                        >
                          {statusIcons[invitation.rsvp_status]}
                          <span>
                            {invitation.rsvp_status.charAt(0).toUpperCase() +
                              invitation.rsvp_status.slice(1)}
                          </span>
                        </div>
                      </div>

                      <div className="mt-3 pt-3 border-t border-gray-200 text-sm text-gray-600 space-y-2">
                        <div className="flex items-center gap-2">
                          <Mail size={14} />
                          <span>
                            Diundang pada: {parseToWIB(invitation.invited_at)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ),
                )}
              </div>
            )}

            {inviteesResponse && inviteesResponse.data.length === 0 && (
              <p>Belum ada data undangan untuk acara ini.</p>
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
