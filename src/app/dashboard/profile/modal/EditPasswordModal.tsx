import { UpdateUserRequest } from "@/types/user";
import { Dialog, DialogPanel } from "@headlessui/react";
import clsxm from "@/lib/clsxm";
import { X } from "lucide-react";
import Button from "@/components/buttons/Button";
import { FormProvider, useForm } from "react-hook-form";
import Input from "@/components/form/Input";

interface EditModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  type?: string;
  mutate: (data: UpdateUserRequest) => void;
  isPending: boolean;
}

export default function EditPasswordModal({
  isOpen,
  setIsOpen,
  mutate,
  isPending,
}: EditModalProps) {
  const methods = useForm<{
    password: string;
    confirmPassword: string;
  }>({
    mode: "onChange",
  });

  const {
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = methods;
  const password = watch("password");

  const onSubmit = (data: { password: string }) => {
    mutate({ password: data.password });
    setIsOpen(false);
  };

  const validatePasswordMatch = (value: string) => {
    return value === password || "Password tidak cocok!";
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
                Ubah Password
              </h2>
              <div className="mb-4 space-y-4">
                <Input
                  id="password"
                  label="Password Baru"
                  placeholder="Masukkan password baru"
                  type="password"
                  validation={{
                    required: "Password wajib diisi",
                    minLength: {
                      value: 8,
                      message: "Password minimal terdiri dari 8 karakter",
                    },
                  }}
                />
                <Input
                  id="confirmPassword"
                  label="Konfirmasi Password"
                  placeholder="Konfirmasi password baru"
                  type="password"
                  validation={{
                    required: "Konfirmasi password wajib diisi",
                    validate: validatePasswordMatch,
                  }}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  onClick={() => {
                    reset();
                    setIsOpen(false);
                  }}
                  variant="red"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="blue"
                  disabled={
                    isPending || !!errors.password || !!errors.confirmPassword
                  }
                >
                  {isPending ? "Saving..." : "Save"}
                </Button>
              </div>
            </form>
          </FormProvider>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
