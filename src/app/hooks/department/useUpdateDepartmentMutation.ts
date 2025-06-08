import api from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { UpdateDepartmentRequest } from "@/types/department";

interface useUpdateDepartmentMutationProps {
  id: string;
}

export default function useUpdateDepartmentMutation({
  id,
}: useUpdateDepartmentMutationProps) {
  const queryClient = useQueryClient();

  const { mutate, mutateAsync, isPending, data, isError, isSuccess } =
    useMutation({
      mutationFn: async (data: UpdateDepartmentRequest) => {
        return await api.patch(`/department/${id}`, data);
      },
      onSuccess: () => {
        toast.success("Departemen berhasil diupdate!");
        queryClient.invalidateQueries({ queryKey: ["departments", id] });
      },
      onError: (err) => {
        toast.error(err?.message || "Gagal menyimpan departemen!");
      },
    });

  return { mutate, mutateAsync, isPending, data, isError, isSuccess };
}
