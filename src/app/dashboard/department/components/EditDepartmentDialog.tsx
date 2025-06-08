"use client";

import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Dialog, DialogPanel } from "@headlessui/react";
import { Edit, X } from "lucide-react";
import Button from "@/components/buttons/Button";
import Input from "@/components/form/Input";
import clsxm from "@/lib/clsxm";
import useUpdateDepartmentMutation from "@/app/hooks/department/useUpdateDepartmentMutation";
import { Department, UpdateDepartmentRequest } from "@/types/department";

interface EditDepartmentDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  department: Department | null;
}

export default function EditDepartmentDialog({
  isOpen,
  setIsOpen,
  department,
}: EditDepartmentDialogProps) {
  const { mutate: updateDepartment, isPending: isUpdating } =
    useUpdateDepartmentMutation({ id: department?.id! });

  const methods = useForm<UpdateDepartmentRequest>({
    mode: "onChange",
  });

  const { handleSubmit, reset } = methods;

  React.useEffect(() => {
    if (isOpen && department) {
      reset({
        name: department.name,
        faculty: department.faculty,
        email: department.email,
      });
    }
  }, [isOpen, department, reset]);

  const onSubmit = (data: UpdateDepartmentRequest) => {
    if (!department) return;

    updateDepartment(data, {
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

  if (!department) return null;

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

          <div className="pr-8">
            <div className="flex items-center gap-3 mb-6">
              <Edit size={24} className="text-primary-base" />
              <h2 className="text-xl font-semibold">Edit Departemen</h2>
            </div>

            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                    {isUpdating ? "Memproses..." : "Update Departemen"}
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
