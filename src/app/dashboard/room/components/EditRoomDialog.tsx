"use client";

import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Dialog, DialogPanel } from "@headlessui/react";
import { Edit, X } from "lucide-react";
import Button from "@/components/buttons/Button";
import Input from "@/components/form/Input";
import clsxm from "@/lib/clsxm";
import { Room, UpdateRoomRequest } from "@/types/room";
import useUpdateRoomMutation from "@/app/hooks/room/useUpdateRoomMutation";
import useAuthStore from "@/app/stores/useAuthStore";

interface EditRoomDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  room: Room | null;
}

export default function EditRoomDialog({
  isOpen,
  setIsOpen,
  room,
}: EditRoomDialogProps) {
  const methods = useForm<UpdateRoomRequest>({
    mode: "onChange",
  });

  const { user } = useAuthStore();
  const { handleSubmit, reset } = methods;
  const { mutate: updateRoom, isPending: isUpdating } = useUpdateRoomMutation({
    roomId: room?.id!,
    departmentId: user?.id!,
  });

  React.useEffect(() => {
    if (isOpen && room) {
      reset({
        name: room.name,
        capacity: room.capacity,
      });
    }
  }, [isOpen, room, reset]);

  const onSubmit = (data: UpdateRoomRequest) => {
    if (!room) return;

    updateRoom(data, {
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

  if (!room) return null;

  return (
    <Dialog open={isOpen} onClose={handleClose} className="relative z-50">
      <div className="fixed inset-0 flex items-center justify-center bg-black/20 pr-4 max-md:pl-4">
        <DialogPanel
          className={clsxm(
            "bg-white relative shadow-lg text-gray-900 rounded-lg p-6 w-[40%] max-lg:w-[50%] max-md:w-[70%] max-sm:w-full max-h-[80vh] overflow-y-auto",
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
              <h2 className="text-xl font-semibold">Edit Ruangan</h2>
            </div>

            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                    {isUpdating ? "Memproses..." : "Update Ruangan"}
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
