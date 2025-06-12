// hooks/invitation/useGetInvitations.ts
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { Invitation } from "@/types/invitation";
import { ApiResponse } from "@/types/api";

export default function useGetInvitations(userId: string) {
  return useQuery<ApiResponse<Invitation[]>>({
    queryKey: ["invitations", userId],
    queryFn: async () => {
      const response = await api.get(`/invitation/user/${userId}`);
      return response.data;
    },
    enabled: !!userId,
  });
}
