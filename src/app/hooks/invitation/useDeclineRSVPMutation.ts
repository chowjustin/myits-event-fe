import api from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface RsvpMutationProps {
  userId: string;
}

export function useDeclineInvitation({ userId }: RsvpMutationProps) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (invitationId: string) => {
      const response = await api.get(
        `/invitation/rsvp/decline/${invitationId}`,
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invitations", userId] });
    },
  });
}
