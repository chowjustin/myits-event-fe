import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { toast } from "react-hot-toast";

export default function useDeleteRoomMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (roomId: string) => {
      const response = await api.delete(`/room/${roomId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
      toast.success("Ruangan berhasil dihapus");
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message || "Gagal menghapus ruangan";
      toast.error(errorMessage);
    },
  });
}
