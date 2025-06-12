import api from "@/lib/api";
import { ApiResponse } from "@/types/api";
import { User } from "@/types/user";
import { useQuery } from "@tanstack/react-query";

export function useGetAllUsers() {
  return useQuery<ApiResponse<User[]>>({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await api.get(`/auth/all?per_page=10000`);
      return response.data;
    },
  });
}
