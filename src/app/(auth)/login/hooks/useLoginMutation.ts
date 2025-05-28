import { useMutation } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { setToken } from "@/lib/cookies";
import { LoginError, LoginRequest, LoginResponse } from "@/types/auth/login";
import { User } from "@/types/user";
import useAuthStore from "@/app/stores/useAuthStore";
import { ApiResponse } from "@/types/api";

export default function useLoginMutation() {
  const { login } = useAuthStore();

  const router = useRouter();

  const { mutate, isPending } = useMutation<
    AxiosResponse,
    AxiosError<LoginError>,
    LoginRequest
  >({
    mutationFn: async (data: LoginRequest) => {
      const res = await api.post<ApiResponse<LoginResponse>>(
        "/auth/login",
        data,
      );

      const token = res.data.data.access_token;
      setToken(token);

      const user = await api.get<ApiResponse<User>>("/auth/me");

      if (user) login({ ...user.data.data, token: token });

      return res;
    },
    onSuccess: () => {
      toast.success("Anda berhasil login");
      router.push("/dashboard");
    },
    onError: (error) => {
      toast.error(error?.response?.data.error || error.message);
    },
  });
  return { mutate, isPending };
}
