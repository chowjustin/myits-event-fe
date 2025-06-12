import api from "@/lib/api";
import { CreateBookingRequest } from "@/types/booking-request";
import { useMutation } from "@tanstack/react-query";

export function useCreateBookingReqMutation() {
  return useMutation({
    mutationFn: async (data: CreateBookingRequest) => {
      const response = await api.post("/booking-request/", data);
      return response.data;
    },
  });
}
