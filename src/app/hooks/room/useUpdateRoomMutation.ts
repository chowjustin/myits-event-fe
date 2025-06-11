import api from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { UpdateRoomRequest } from "@/types/room";

interface useUpdateRoomMutationProps {
  roomId: string;
  departmentId: string;
}

export default function useUpdateRoomMutation({
  roomId,
}: useUpdateRoomMutationProps) {
  const queryClient = useQueryClient();

  const { mutate, mutateAsync, isPending, data, isError, isSuccess } =
    useMutation({
      mutationFn: async (data: UpdateRoomRequest) => {
        return await api.patch(`/room/${roomId}`, {
          ...data,
          department_id: data.department_id,
        });
      },
      onSuccess: () => {
        toast.success("Ruangan berhasil diupdate!");
        queryClient.invalidateQueries({ queryKey: ["rooms"] });
      },
      onError: (err) => {
        toast.error(err?.message || "Gagal menyimpan ruangan!");
      },
    });

  return { mutate, mutateAsync, isPending, data, isError, isSuccess };
}
