import api from "@/lib/api";
import { ApiResponse } from "@/types/api";
import { User } from "@/types/user";
import { useQuery } from "@tanstack/react-query";

interface GetAllUsersQueryParams {
  role?: string;
}

export function useGetAllUsers({ role }: GetAllUsersQueryParams = {}) {
  return useQuery<ApiResponse<User[]>>({
    queryKey: ["users", role],
    queryFn: async () => {
      const query = role
        ? `/auth/all?per_page=10000&role=${role}`
        : `/auth/all?per_page=10000`;
      const response = await api.get(query);
      return response.data;
    },
    refetchOnWindowFocus: false,
  });
}
