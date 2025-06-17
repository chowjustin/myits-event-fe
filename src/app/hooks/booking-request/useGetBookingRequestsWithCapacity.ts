import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { ApiResponse } from "@/types/api";
import { BookingRequestWithCapacity } from "@/types/booking-request";

export default function useGetBookingRequestsWithCapacity() {
  return useQuery<ApiResponse<BookingRequestWithCapacity[]>>({
    queryKey: ["booking-requests-with-capacity"],
    queryFn: async () => {
      const response = await api.get(`/booking-request/with-capacity`);
      return response.data;
    },
  });
}
