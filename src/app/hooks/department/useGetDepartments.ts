import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

export type DepartmentQueryParams = {
  page: number;
  per_page: number;
};

interface Department {
  id: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

type ApiResponse = {
  data: Department[];
  meta: {
    page: number;
    per_page: number;
    max_page: number;
    count: number;
  };
};

export default function useGetDepartments(queryParams: DepartmentQueryParams) {
  return useQuery<ApiResponse>({
    queryKey: ["departments", queryParams],
    queryFn: async () => {
      const response = await api.get(`/department/`, {
        params: queryParams,
      });
      return response.data;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes until data becomes stale
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: true,
  });
}
