"use client";

import Button from "@/components/buttons/Button";
import Input from "@/components/form/Input";
import NextImage from "@/components/NextImage";
import { LoginRequest } from "@/types/auth/login";
import Link from "next/link";
import { FormProvider, useForm } from "react-hook-form";
import useLoginMutation from "./hooks/useLoginMutation";
import withAuth from "@/components/hoc/withAuth";

export default withAuth(LoginPage, "public");

function LoginPage() {
  const methods = useForm<LoginRequest>({
    mode: "onChange",
  });

  const { handleSubmit } = methods;

  const { mutate: mutateLogin, isPending } = useLoginMutation();
  const onSubmit = (data: LoginRequest) => {
    mutateLogin(data);
  };

  return (
    <section className="w-full h-screen flex justify-center items-center max-sm:px-4 bg-[url(/images/background-sso.svg)] bg-cover bg-center">
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-[40%] max-lg:w-3/4 max-sm:w-full flex flex-col gap-4 bg-white shadow-md py-8 px-4 max-md:p-6 rounded-xl"
        >
          <Link href="/">
            <NextImage
              width={552}
              height={388}
              src={"/myits-event.png"}
              alt="myITS Event"
              className="flex max-w-[90px] items-center mx-auto mb-4 md:max-w-[120px]"
            />
          </Link>
          <Input
            id="email"
            type="email"
            label="Email"
            placeholder="Email"
            validation={{ required: "Email harus diisi" }}
          />
          <Input
            id="password"
            type="password"
            label="Password"
            placeholder="Password"
            validation={{
              required: "Password Harus Diisi",
              minLength: {
                value: 8,
                message: "Password Minimal 8 Karakter",
              },
            }}
          />

          <Button
            variant="blue"
            className="w-full mt-2"
            type="submit"
            onClick={handleSubmit(onSubmit)}
            isLoading={isPending}
          >
            Login
          </Button>
          <div className="text-center text-gray-500 text-sm -mt-2">
            Belum punya akun?{" "}
            <Link
              href="/register"
              className="text-blue-600 hover:text-blue-800 hover:underline"
            >
              Daftar
            </Link>
          </div>
        </form>
      </FormProvider>
    </section>
  );
}
