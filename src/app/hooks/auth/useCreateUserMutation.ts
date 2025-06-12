import api from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { CreateUserRequest } from "@/types/user";
import { usePathname, useRouter } from "next/navigation";
import { ApiError } from "@/types/api";

export default function useCreateUserMutation() {
  const router = useRouter();
  const path = usePathname();
  const queryClient = useQueryClient();

  const { mutate, mutateAsync, isPending, data, isError } = useMutation({
    mutationFn: async (data: CreateUserRequest) => {
      return await api.post("/auth/register", data);
    },
    onSuccess: () => {
      toast.success("Akun berhasil dibuat!");
      if (path === "/register") {
        router.push("/login");
      }
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (err: ApiError) => {
      toast.error(err?.response?.data?.error || "Gagal membuat akun!");
    },
  });

  return { mutate, mutateAsync, isPending, data, isError };
}
