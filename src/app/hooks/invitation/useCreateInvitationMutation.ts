import api from "@/lib/api";
import { CreateInvitationRequest } from "@/types/invitation";
import { useMutation } from "@tanstack/react-query";

export function useCreateInvitationMutation() {
  return useMutation({
    mutationFn: async (data: CreateInvitationRequest) => {
      const response = await api.post("/invitation/", data);
      return response.data;
    },
  });
}
