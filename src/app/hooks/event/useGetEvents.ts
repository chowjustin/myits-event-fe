import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { Event } from "@/types/event";

export type EventQueryParams = {
  page: number;
  per_page: number;
};

type ApiResponse = {
  data: { data: Event[] };
  page: number;
  per_page: number;
  max_page: number;
  count: number;
};

export default function useGetEvents(queryParams?: EventQueryParams) {
  return useQuery<ApiResponse>({
    queryKey: ["events", queryParams],
    queryFn: async () => {
      const response = await api.get(`/event/`, {
        params: queryParams,
      });
      return response.data;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes until data becomes stale
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: true,
  });
}
