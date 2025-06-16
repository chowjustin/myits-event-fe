import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { ApiResponse } from "@/types/api";
import { Attendee } from "@/types/event";

export default function useGetAttendees(eventId: string) {
  return useQuery<ApiResponse<Attendee[]>>({
    queryKey: ["attendees", eventId],
    queryFn: async () => {
      const response = await api.get(`/event/${eventId}/attendees`);
      return response.data;
    },
    enabled: !!eventId,
  });
}
