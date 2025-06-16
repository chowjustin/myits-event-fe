import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { ApiResponse } from "@/types/api";
import { BookingRequest } from "@/types/booking-request";

export default function useGetBookingRequests() {
  return useQuery<ApiResponse<BookingRequest[]>>({
    queryKey: ["booking-requests"],
    queryFn: async () => {
      const response = await api.get(`/booking-request/`);
      return response.data;
    },
  });
}
