import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";

interface RsvpMutationProps {
  userId: string;
}

export function useAcceptInvitation({ userId }: RsvpMutationProps) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (invitationId: string) => {
      const response = await api.get(`/invitation/rsvp/accept/${invitationId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invitations", userId] });
    },
  });
}
