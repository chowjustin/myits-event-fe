"use client";

import { Disclosure } from "@headlessui/react";
import { ChevronDown, ChevronUp, Plus } from "lucide-react";
import { FormProvider, useForm } from "react-hook-form";
import Input from "@/components/form/Input";
import Button from "@/components/buttons/Button";
import { CreateUserRequest } from "@/types/user";
import useCreateUserMutation from "@/app/hooks/auth/useCreateUserMutation";

export default function CreateOrganizationCard() {
  const methods = useForm<CreateUserRequest>({
    mode: "onChange",
  });

  const { handleSubmit, reset } = methods;
  const { mutate: createOrganization, isPending } = useCreateUserMutation();

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
                  Tambah Organisasi Baru
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
                      role: "ormawa",
                    };

                    createOrganization(payload, {
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
                          label="Nama Organisasi"
                          placeholder="Nama Organisasi"
                          validation={{
                            required: "Nama Organisasi harus diisi",
                          }}
                        />
                        <Input
                          id="email"
                          type="email"
                          label="Email Organisasi"
                          placeholder="Email Organisasi"
                          validation={{
                            required: "Email Organisasi harus diisi",
                          }}
                        />
                        <Input
                          id="password"
                          type="password"
                          label="Password Organisasi"
                          placeholder="Password Organisasi"
                          validation={{
                            required: "Password Organisasi harus diisi",
                          }}
                        />

                        <div className="flex justify-end">
                          <Button
                            type="submit"
                            variant="primary"
                            className="w-fit whitespace-nowrap"
                            disabled={isPending}
                          >
                            {isPending ? "Memproses..." : "Tambah Organisasi"}
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
