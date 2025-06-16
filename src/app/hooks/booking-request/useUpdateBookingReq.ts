import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { toast } from "react-hot-toast";

interface useUpdateBookingRequestProps {
  bookingId: string;
  action: "approve" | "reject";
}

export default function useUpdateBookingRequest({
  bookingId,
  action,
}: useUpdateBookingRequestProps) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await api.patch(
        `/booking-request/${bookingId}/${action}`,
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["booking-requests"] });
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message || "Gagal memperbarui booking request";
      toast.error(errorMessage);
    },
  });
}
