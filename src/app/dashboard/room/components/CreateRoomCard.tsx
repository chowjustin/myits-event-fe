"use client";

import { Disclosure } from "@headlessui/react";
import { ChevronDown, ChevronUp, Plus } from "lucide-react";
import { FormProvider, useForm } from "react-hook-form";
import Input from "@/components/form/Input";
import Button from "@/components/buttons/Button";
import { CreateRoomRequest } from "@/types/room";
import useCreateRoomMutation from "@/app/hooks/room/useCreateRoomMutation";

export default function CreateRoomCard() {
  const methods = useForm<CreateRoomRequest>({
    mode: "onChange",
  });

  const { handleSubmit, reset } = methods;
  const { mutate: createRoom, isPending } = useCreateRoomMutation();

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
                  Tambah Ruangan Baru
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
                    createRoom(data, {
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
                          label="Nama Ruangan"
                          placeholder="Nama Ruangan"
                          validation={{
                            required: "Nama Ruangan harus diisi",
                          }}
                        />
                        <Input
                          id="capacity"
                          label="Kapasitas Ruangan"
                          placeholder="Kapasitas Ruangan"
                          validation={{
                            required: "Kapasitas Ruangan harus diisi",
                            valueAsNumber: true,
                          }}
                        />

                        <div className="flex justify-end">
                          <Button
                            type="submit"
                            variant="primary"
                            className="w-fit whitespace-nowrap"
                            disabled={isPending}
                          >
                            {isPending ? "Memproses..." : "Tambah Ruangan"}
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
