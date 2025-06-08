"use client";

import React from "react";
import { Disclosure } from "@headlessui/react";
import { ChevronDown, ChevronUp, Plus } from "lucide-react";
import { FormProvider, useForm } from "react-hook-form";
import Input from "@/components/form/Input";
import Button from "@/components/buttons/Button";
import useCreateDepartmentMutation from "@/app/hooks/department/useCreateDepartmentMutation";
import { CreateDepartmentRequest } from "@/types/department";

export default function CreateDepartmentCard() {
  const methods = useForm<CreateDepartmentRequest>({
    mode: "onChange",
  });

  const { handleSubmit, reset } = methods;
  const { mutate: createDepartment, isPending } = useCreateDepartmentMutation();

  return (
    <div>
      <Disclosure
        as="div"
        className="bg-white rounded-lg shadow-sm border-gray-200 border"
      >
        {({ open, close }) => (
          <>
            <Disclosure.Button className="flex w-full justify-between items-center p-6 text-left">
              <div className="flex items-center gap-3">
                <Plus
                  size={24}
                  className="text-primary-base max-lg:max-w-[20px]"
                />
                <h2 className="text-2xl max-lg:text-lg font-semibold">
                  Tambah Departemen Baru
                </h2>
              </div>
              {open ? (
                <ChevronUp className="h-5 w-5 text-gray-500" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-500" />
              )}
            </Disclosure.Button>

            <Disclosure.Panel className="px-6 pb-6">
              <FormProvider {...methods}>
                <form
                  onSubmit={handleSubmit((data) => {
                    const payload = {
                      ...data,
                      role: "departemen",
                    };

                    createDepartment(payload, {
                      onSuccess: () => {
                        close();
                        reset();
                      },
                    });
                  })}
                >
                  <div className="space-y-6">
                    <div className="">
                      <div className="space-y-4">
                        <Input
                          id="name"
                          label="Nama Departemen"
                          placeholder="Nama Departemen"
                          validation={{
                            required: "Nama departemen harus diisi",
                          }}
                        />
                        <Input
                          id="faculty"
                          label="Nama Fakultas"
                          placeholder="Nama Fakultas"
                          validation={{
                            required: "Nama fakultas harus diisi",
                          }}
                        />
                        <Input
                          id="email"
                          type="email"
                          label="Email"
                          placeholder="Email akun departemen"
                          validation={{
                            required: "Email akun harus diisi",
                          }}
                        />
                        <Input
                          id="password"
                          type="password"
                          label="Password"
                          placeholder="Password akun departemen"
                          validation={{
                            required: "Password akun harus diisi",
                            minLength: {
                              value: 8,
                              message: "Password minimal 8 karakter",
                            },
                          }}
                        />

                        <div className="flex justify-end">
                          <Button
                            type="submit"
                            variant="primary"
                            className="w-fit whitespace-nowrap"
                            disabled={isPending}
                          >
                            {isPending ? "Memproses..." : "Tambah Departemen"}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </FormProvider>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    </div>
  );
}
