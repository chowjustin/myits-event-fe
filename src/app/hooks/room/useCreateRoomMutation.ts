import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { toast } from "react-hot-toast";
import { CreateRoomRequest } from "@/types/room";

export default function useCreateRoomMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateRoomRequest) => {
      const response = await api.post("/room/", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
      toast.success("Ruangan berhasil ditambahkan");
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message || "Gagal menambahkan ruangan";
      toast.error(errorMessage);
    },
  });
}
