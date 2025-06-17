import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { ApiResponse } from "@/types/api";
import { Attendee } from "@/types/event";

export default function useGetInviteesByEventID(eventId: string) {
  return useQuery<ApiResponse<Attendee[]>>({
    queryKey: ["invitees", eventId],
    queryFn: async () => {
      const response = await api.get(`/invitation/event/${eventId}`);
      return response.data;
    },
    enabled: !!eventId,
  });
}
