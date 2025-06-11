"use client";

import React from "react";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { Dialog, DialogPanel } from "@headlessui/react";
import { Edit, X } from "lucide-react";
import Button from "@/components/buttons/Button";
import Input from "@/components/form/Input";
import clsxm from "@/lib/clsxm";
import useUpdateEventMutation from "@/app/hooks/event/useUpdateEventMutation";
import { Event, UpdateEventRequest } from "@/types/event";
import FormDatePicker from "@/components/form/DatePicker";
import TextArea from "@/components/form/TextArea";
import SelectInput from "@/components/form/SelectInput";

interface EditEventDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  event: Event | null;
}

export default function EditEventDialog({
  isOpen,
  setIsOpen,
  event,
}: EditEventDialogProps) {
  const { mutate: updateEvent, isPending: isUpdating } = useUpdateEventMutation(
    { id: event?.id! },
  );

  const methods = useForm<UpdateEventRequest>({
    mode: "onChange",
  });

  const { handleSubmit, reset, control } = methods;

  const startTime = useWatch({
    control,
    name: "start_time",
  });

  React.useEffect(() => {
    if (isOpen && event) {
      reset({
        name: event.name,
        description: event.description,
        start_time: event.start_time,
        end_time: event.end_time,
        event_type: event.event_type,
      });
    }
  }, [isOpen, event, reset]);

  const onSubmit = (data: UpdateEventRequest) => {
    if (!event) return;

    updateEvent(data, {
      onSuccess: () => {
        setIsOpen(false);
        reset();
      },
    });
  };

  const handleClose = () => {
    setIsOpen(false);
    reset();
  };

  if (!event) return null;

  return (
    <Dialog open={isOpen} onClose={handleClose} className="relative z-50">
      <div className="fixed inset-0 flex items-center justify-center bg-black/20 pr-4 max-md:pl-4">
        <DialogPanel
          className={clsxm(
            "bg-white relative shadow-lg text-gray-900 rounded-lg p-6 w-[70%] max-lg:w-[60%] max-md:w-[80%] max-sm:w-full max-h-[80vh] overflow-y-auto",
          )}
        >
          <button
            onClick={handleClose}
            className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
          >
            <X strokeWidth={2.5} size={20} />
          </button>

          <div>
            <div className="flex items-center gap-3 mb-6">
              <Edit size={24} className="text-primary-base" />
              <h2 className="text-xl font-semibold">Edit Departemen</h2>
            </div>

            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                    minDate={startTime ? new Date(startTime) : undefined}
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

                <div className="flex justify-end gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleClose}
                    disabled={isUpdating}
                  >
                    Batal
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={isUpdating}
                    className="flex items-center gap-2"
                  >
                    {isUpdating ? "Memproses..." : "Update Event"}
                  </Button>
                </div>
              </form>
            </FormProvider>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}

const eventTypeOptions = [
  { value: "offline", label: "Offline" },
  { value: "online", label: "Online" },
];
