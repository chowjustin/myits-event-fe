import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { Attendee } from "@/types/event";

export type AllAttendeesQueryParams = {
  page: number;
  per_page: number;
};

export interface AllAttendeesApiResponse {
  status: boolean;
  message: string;
  data: Attendee[];
  meta: {
    page: number;
    per_page: number;
    max_page: number;
    count: number;
  };
}

export default function useGetAllAttendees(
  queryParams: AllAttendeesQueryParams,
  role: string,
) {
  return useQuery<AllAttendeesApiResponse>({
    queryKey: ["all-attendees", queryParams],
    queryFn: async () => {
      const response = await api.get(`/event/attendance/all`, {
        params: queryParams,
      });
      return response.data;
    },
    enabled: role === "admin", // Only fetch if the user is an admin
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
}
