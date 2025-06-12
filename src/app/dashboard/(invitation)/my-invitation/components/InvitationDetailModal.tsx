"use client";

import { Dialog, DialogPanel } from "@headlessui/react";
import { Calendar, Clock, X, Check, XCircle } from "lucide-react";
import Button from "@/components/buttons/Button";
import clsxm from "@/lib/clsxm";
import { Invitation } from "@/types/invitation";
import { useAcceptInvitation } from "@/app/hooks/invitation/useAcceptRSVPMutation";
import { useDeclineInvitation } from "@/app/hooks/invitation/useDeclineRSVPMutation";
import { parseToWIB } from "@/utils/parseToWib";

interface InvitationDetailModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  invitation: Invitation | null;
  userId: string;
}

export default function InvitationDetailModal({
  isOpen,
  setIsOpen,
  invitation,
  userId,
}: InvitationDetailModalProps) {
  const { mutate: acceptInvitation, isPending: isAccepting } =
    useAcceptInvitation({ userId });
  const { mutate: declineInvitation, isPending: isDeclining } =
    useDeclineInvitation({ userId });

  const handleAccept = () => {
    if (!invitation) return;

    acceptInvitation(invitation.id, {
      onSuccess: () => {
        setIsOpen(false);
      },
    });
  };

  const handleDecline = () => {
    if (!invitation) return;

    declineInvitation(invitation.id, {
      onSuccess: () => {
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
      case "accepted":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <Check size={12} />
            Diterima
          </span>
        );
      case "declined":
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

  if (!invitation) return null;

  return (
    <Dialog open={isOpen} onClose={handleClose} className="relative z-50">
      <div className="fixed inset-0 flex items-center justify-center bg-black/50 px-4">
        <DialogPanel
          className={clsxm(
            "bg-white relative shadow-xl text-gray-900 rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto",
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
              <Calendar
                size={24}
                className="text-primary-600 mt-1 flex-shrink-0"
              />
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  {invitation.event_name}
                </h2>
                {getStatusBadge(invitation.rsvp_status)}
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-3">
                  Detail Undangan
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tanggal Undangan:</span>
                    <span className="text-gray-900 font-medium">
                      {parseToWIB(invitation.invited_at)}
                    </span>
                  </div>
                  {invitation.rsvp_at && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tanggal RSVP:</span>
                      <span className="text-gray-900 font-medium">
                        {parseToWIB(invitation.rsvp_at)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className="text-gray-900 font-medium capitalize">
                      {invitation.rsvp_status === "pending"
                        ? "Menunggu"
                        : invitation.rsvp_status === "accepted"
                          ? "Diterima"
                          : "Ditolak"}
                    </span>
                  </div>
                </div>
              </div>

              {invitation.rsvp_status === "pending" && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-medium text-blue-900 mb-3">RSVP</h3>
                  <p className="text-sm text-blue-800 mb-4">
                    Silakan pilih respons Anda untuk undangan ini:
                  </p>

                  <div className="flex gap-3">
                    <Button
                      type="button"
                      variant="primary"
                      onClick={handleAccept}
                      disabled={isAccepting || isDeclining}
                      className="flex-1 flex items-center justify-center gap-2"
                    >
                      <Check size={16} />
                      {isAccepting ? "Memproses..." : "Terima"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleDecline}
                      disabled={isAccepting || isDeclining}
                      className="flex-1 flex items-center justify-center gap-2 border-red-300 text-red-700 hover:bg-red-50"
                    >
                      <XCircle size={16} />
                      {isDeclining ? "Memproses..." : "Tolak"}
                    </Button>
                  </div>
                </div>
              )}

              {invitation.rsvp_status !== "pending" && (
                <div
                  className={clsxm(
                    "rounded-lg p-4 border",
                    invitation.rsvp_status === "accepted"
                      ? "bg-green-50 border-green-200"
                      : "bg-red-50 border-red-200",
                  )}
                >
                  <p
                    className={clsxm(
                      "text-sm font-medium",
                      invitation.rsvp_status === "accepted"
                        ? "text-green-800"
                        : "text-red-800",
                    )}
                  >
                    {invitation.rsvp_status === "accepted"
                      ? "Anda telah menerima undangan ini"
                      : "Anda telah menolak undangan ini"}
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isAccepting || isDeclining}
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
