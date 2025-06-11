import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { ApiResponse } from "@/types/api";
import { Room } from "@/types/room";

export default function useGetAllRooms() {
  return useQuery<ApiResponse<Room>>({
    queryKey: ["rooms"],
    queryFn: async () => {
      const response = await api.get(`/room/`);
      return response.data;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes until data becomes stale
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: true,
  });
}
