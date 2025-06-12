"use client";

import { useState } from "react";
import {
  Calendar,
  Clock,
  Check,
  XCircle,
  Mail,
  Search,
  Filter,
} from "lucide-react";
import clsxm from "@/lib/clsxm";
import { Invitation } from "@/types/invitation";
import useGetInvitations from "@/app/hooks/invitation/useGetInvitations";
import InvitationDetailModal from "./components/InvitationDetailModal";
import useAuthStore from "@/app/stores/useAuthStore";
import withAuth from "@/components/hoc/withAuth";

export default withAuth(InvitationListPage, "user");
function InvitationListPage() {
  const [selectedInvitation, setSelectedInvitation] =
    useState<Invitation | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "pending" | "accepted" | "declined"
  >("all");

  const { user } = useAuthStore();

  const {
    data: invitationsResponse,
    isLoading,
    error,
  } = useGetInvitations(user?.id!);

  const invitations = invitationsResponse?.data || [];

  const handleInvitationClick = (invitation: Invitation) => {
    setSelectedInvitation(invitation);
    setIsModalOpen(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
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

  const filteredInvitations = invitations.filter((invitation) => {
    const matchesSearch = invitation.event_name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || invitation.rsvp_status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const pendingCount = invitations.filter(
    (inv) => inv.rsvp_status === "pending",
  ).length;
  const acceptedCount = invitations.filter(
    (inv) => inv.rsvp_status === "accepted",
  ).length;
  const declinedCount = invitations.filter(
    (inv) => inv.rsvp_status === "declined",
  ).length;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat undangan...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600">Gagal memuat undangan</p>
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
            <Mail className="h-8 w-8 text-primary-600" />
            <h1 className="text-3xl font-bold text-gray-900">Undangan Saya</h1>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg p-4 shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {invitations.length}
                  </p>
                </div>
                <Mail className="h-8 w-8 text-gray-400" />
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
                  <p className="text-sm text-gray-600">Diterima</p>
                  <p className="text-2xl font-bold text-green-600">
                    {acceptedCount}
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
                    {declinedCount}
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
                placeholder="Cari undangan..."
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
                <option value="accepted">Diterima</option>
                <option value="declined">Ditolak</option>
              </select>
            </div>
          </div>
        </div>

        {/* Invitation List */}
        {filteredInvitations.length === 0 ? (
          <div className="text-center py-12">
            <Mail className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm || statusFilter !== "all"
                ? "Tidak ada undangan yang cocok"
                : "Belum ada undangan"}
            </h3>
            <p className="text-gray-600">
              {searchTerm || statusFilter !== "all"
                ? "Coba ubah pencarian atau filter Anda"
                : "Undangan baru akan muncul di sini"}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredInvitations.map((invitation) => (
              <div
                key={invitation.id}
                onClick={() => handleInvitationClick(invitation)}
                className={clsxm(
                  "bg-white rounded-lg p-6 shadow-sm border cursor-pointer transition-all duration-200 hover:shadow-md hover:border-primary-300",
                  invitation.rsvp_status === "pending" &&
                    "border-l-4 border-l-yellow-400",
                  invitation.rsvp_status === "accepted" &&
                    "border-l-4 border-l-green-400",
                  invitation.rsvp_status === "declined" &&
                    "border-l-4 border-l-red-400",
                )}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {invitation.event_name}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        <span>
                          Diundang: {formatDate(invitation.invited_at)}
                        </span>
                      </div>
                      {invitation.rsvp_at && (
                        <div className="flex items-center gap-1">
                          <Clock size={14} />
                          <span>RSVP: {formatDate(invitation.rsvp_at)}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      {getStatusBadge(invitation.rsvp_status)}
                      {invitation.rsvp_status === "pending" && (
                        <span className="text-sm text-primary-600 font-medium">
                          Klik untuk merespons →
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
        <InvitationDetailModal
          isOpen={isModalOpen}
          setIsOpen={setIsModalOpen}
          invitation={selectedInvitation}
          userId={user?.id!}
        />
      </div>
    </div>
  );
}
