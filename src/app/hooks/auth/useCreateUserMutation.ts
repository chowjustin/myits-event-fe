import api from "@/lib/api";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { CreateUserRequest } from "@/types/user";
import { useRouter } from "next/navigation";
import { ApiError } from "@/types/api";

export default function useCreateUserMutation() {
  const router = useRouter();

  const { mutate, mutateAsync, isPending, data, isError } = useMutation({
    mutationFn: async (data: CreateUserRequest) => {
      return await api.post("/auth/register", data);
    },
    onSuccess: () => {
      toast.success("Akun berhasil dibuat!");
      router.push("/login");
    },
    onError: (err: ApiError) => {
      toast.error(err?.response?.data?.error || "Gagal membuat akun!");
    },
  });

  return { mutate, mutateAsync, isPending, data, isError };
}
