import api from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { UpdateEventRequest } from "@/types/event";

interface useUpdateDepartmentMutationProps {
  id: string;
}

export default function useUpdateDepartmentMutation({
  id,
}: useUpdateDepartmentMutationProps) {
  const queryClient = useQueryClient();

  const { mutate, mutateAsync, isPending, data, isError, isSuccess } =
    useMutation({
      mutationFn: async (data: UpdateEventRequest) => {
        return await api.patch(`/event/${id}`, data);
      },
      onSuccess: () => {
        toast.success("Event berhasil diupdate!");
        queryClient.invalidateQueries({ queryKey: ["events", id] });
      },
      onError: () => {
        toast.error("end time harus lebih besar dari start time");
      },
    });

  return { mutate, mutateAsync, isPending, data, isError, isSuccess };
}
