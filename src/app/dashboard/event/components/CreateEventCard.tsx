"use client";

import { Disclosure } from "@headlessui/react";
import { ChevronDown, ChevronUp, Plus } from "lucide-react";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import Input from "@/components/form/Input";
import Button from "@/components/buttons/Button";
import useCreateEventMutation from "@/app/hooks/event/useCreateEventMutation";
import { CreateEventRequest } from "@/types/event";
import FormDatePicker from "@/components/form/DatePicker";
import SelectInput from "@/components/form/SelectInput";
import TextArea from "@/components/form/TextArea";

export default function CreateEventCard() {
  const methods = useForm<CreateEventRequest>({
    mode: "onChange",
  });

  const { handleSubmit, reset, control } = methods;
  const { mutate: createEvent, isPending } = useCreateEventMutation();

  const startTime = useWatch({
    control,
    name: "start_time",
  });

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
                  Tambah Event Baru
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
                    createEvent(data, {
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
                          label="Nama Event"
                          placeholder="Nama Event"
                          validation={{
                            required: "Nama event harus diisi",
                          }}
                        />
                        <TextArea
                          id="description"
                          label="Deskripsi Event"
                          placeholder="Deskripsi Event"
                          maxLength={500}
                          className="min-h-[100px]"
                          validation={{
                            required: "Deskripsi event harus diisi",
                            minLength: {
                              value: 10,
                              message: "Deskripsi harus minimal 10 karakter",
                            },
                          }}
                        />

                        <div className="flex w-full max-lg:flex-col gap-4 lg:gap-2">
                          <FormDatePicker
                            id="start_time"
                            control={control}
                            label="Tanggal dan Waktu Mulai Event"
                            placeholder="Pilih tanggal dan waktu mulai"
                            includeTime={true}
                            timeIntervals={15}
                            minDate={new Date()}
                            className="w-full"
                            validation={{
                              required: "Tanggal mulai event wajib diisi!",
                            }}
                          />
                          <FormDatePicker
                            id="end_time"
                            control={control}
                            label="Tanggal dan Waktu Selesai Event"
                            placeholder="Pilih tanggal dan waktu selesai"
                            includeTime={true}
                            timeIntervals={15}
                            minDate={
                              startTime ? new Date(startTime) : undefined
                            }
                            disabled={!startTime}
                            className="w-full"
                            validation={{
                              required: "Tanggal selesai event wajib diisi!",
                            }}
                          />
                        </div>

                        <SelectInput
                          id="event_type"
                          label="Tipe Event"
                          placeholder="Tipe Event"
                          options={eventTypeOptions}
                          isSearchable={false}
                          validation={{
                            required: "Tipe event harus diisi",
                          }}
                        />

                        <div className="flex justify-end">
                          <Button
                            type="submit"
                            variant="primary"
                            className="w-fit whitespace-nowrap"
                            disabled={isPending}
                          >
                            {isPending ? "Memproses..." : "Buat Event"}
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

const eventTypeOptions = [
  { value: "offline", label: "Offline" },
  { value: "online", label: "Online" },
];
