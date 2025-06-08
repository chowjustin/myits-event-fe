import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { toast } from "react-hot-toast";

export default function useDeleteDepartmentMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (departmentId: string) => {
      const response = await api.delete(`/department/${departmentId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
      toast.success("Departemen berhasil dihapus");
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message || "Gagal menghapus departemen";
      toast.error(errorMessage);
    },
  });
}
