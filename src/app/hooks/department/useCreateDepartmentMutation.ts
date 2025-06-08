import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { toast } from "react-hot-toast";
import { CreateDepartmentRequest } from "@/types/department";

export default function useCreateDepartmentMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateDepartmentRequest) => {
      const response = await api.post("/department/", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
      toast.success("Departemen berhasil ditambahkan");
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message || "Gagal menambahkan departemen";
      toast.error(errorMessage);
    },
  });
}
