"use client";

import Button from "@/components/buttons/Button";
import Input from "@/components/form/Input";
import NextImage from "@/components/NextImage";
import Link from "next/link";
import { FormProvider, useForm } from "react-hook-form";
import withAuth from "@/components/hoc/withAuth";
import { CreateUserRequest } from "@/types/user";
import useCreateUserMutation from "@/app/hooks/user/useCreateUserMutation";

export default withAuth(RegisterPage, "public");

function RegisterPage() {
  const methods = useForm<CreateUserRequest>({
    mode: "onChange",
  });

  const { handleSubmit } = methods;

  const { mutate: createUser, isPending } = useCreateUserMutation();
  const onSubmit = (data: CreateUserRequest) => {
    createUser({ ...data, role: "user" });
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
            id="name"
            type="text"
            label="Nama"
            placeholder="Nama"
            validation={{ required: "Nama harus diisi" }}
          />
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
            Register
          </Button>
          <div className="text-center text-gray-500 text-sm -mt-2">
            Sudah punya akun?{" "}
            <Link
              href="/login"
              className="text-blue-600 hover:text-blue-800 hover:underline"
            >
              Masuk
            </Link>
          </div>
        </form>
      </FormProvider>
    </section>
  );
}
