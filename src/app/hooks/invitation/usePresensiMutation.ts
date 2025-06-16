import { useMutation } from "@tanstack/react-query";
import api from "@/lib/api";

export function usePresensiMutation() {
  return useMutation({
    mutationFn: async (invitationId: string) => {
      const response = await api.post(
        `/invitation/invitation/scan/${invitationId}`,
      );
      return response.data;
    },
  });
}
