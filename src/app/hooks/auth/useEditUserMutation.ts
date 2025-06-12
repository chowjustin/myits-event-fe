import api from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { UpdateUserRequest } from "@/types/user";

export default function useEditUserMutation() {
  const queryClient = useQueryClient();

  const { mutate, mutateAsync, isPending, data, isError, isSuccess } =
    useMutation({
      mutationFn: async (data: UpdateUserRequest) => {
        return await api.patch(`/auth/update`, data);
      },
      onSuccess: () => {
        toast.success("Data berhasil diupdate!");
        queryClient.invalidateQueries({ queryKey: ["user-me"] });
      },
      onError: (err) => {
        toast.error(err?.message || "Gagal mengupdate data!");
      },
    });

  return { mutate, mutateAsync, isPending, data, isError, isSuccess };
}
