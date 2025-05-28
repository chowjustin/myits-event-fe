import { UpdateUserRequest } from "@/types/user";
import { Dialog, DialogPanel } from "@headlessui/react";
import clsxm from "@/lib/clsxm";
import { X } from "lucide-react";
import Button from "@/components/buttons/Button";
import { FormProvider, useForm } from "react-hook-form";
import Input from "@/components/form/Input";

interface EditModalProps {
  id: string;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  label: string;
  currentValue: string;
  fieldName: string;
  type?: string;
  mutate: (data: UpdateUserRequest) => void;
  isPending: boolean;
}

export default function EditModal({
  id,
  isOpen,
  setIsOpen,
  label,
  currentValue,
  mutate,
  isPending,
}: EditModalProps) {
  const methods = useForm<UpdateUserRequest>({
    mode: "onChange",
  });
  const { handleSubmit } = methods;

  const onSubmit = (data: UpdateUserRequest) => {
    mutate(data);
    setIsOpen(false);
  };

  return (
    <Dialog
      open={isOpen}
      onClose={() => setIsOpen(false)}
      className="relative z-50"
    >
      <div className="fixed inset-0 flex items-center justify-center bg-black/20 pr-4 max-md:pl-4">
        <DialogPanel
          className={clsxm(
            "bg-white relative shadow-lg text-gray-900 rounded-lg p-6 w-[40%] max-md:w-1/2 max-sm:w-full",
          )}
        >
          <button
            onClick={() => setIsOpen(false)}
            className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
          >
            <X strokeWidth={2.5} size={20} />
          </button>

          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <h2 className="text-center text-xl font-semibold mb-6">
                Edit Data
              </h2>
              <div className="mb-4">
                <Input
                  id={id}
                  label={label}
                  placeholder={label}
                  defaultValue={currentValue}
                  validation={{ required: `${label} harus diisi` }}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  variant="red"
                >
                  Batal
                </Button>
                <Button type="submit" variant="blue" disabled={isPending}>
                  {isPending ? "Menyimpan..." : "Simpan"}
                </Button>
              </div>
            </form>
          </FormProvider>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
