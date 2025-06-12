"use client";

import { useForm, FormProvider } from "react-hook-form";
import { useState } from "react";
import BreadCrumbs from "@/components/BreadCrumbs";
import SelectInput from "@/components/form/SelectInput";
import Button from "@/components/buttons/Button";
import useGetEvents from "@/app/hooks/event/useGetEvents";
import { useGetAllUsers } from "@/app/hooks/auth/useGetAllUsers";
import { parseToWIB } from "@/utils/parseToWib";
import toast from "react-hot-toast";
import { CreateInvitationRequest } from "@/types/invitation";
import { useCreateInvitationMutation } from "@/app/hooks/invitation/useCreateInvitationMutation";
import withAuth from "@/components/hoc/withAuth";

const breadCrumbs = [
  { href: "/dashboard", Title: "Dashboard" },
  { href: `/dashboard/invitation`, Title: "Undangan" },
];

export default withAuth(Invitation, "ormawa");
function Invitation() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const methods = useForm<CreateInvitationRequest>({
    defaultValues: {
      event_id: "",
      user_ids: [],
    },
  });

  const { handleSubmit, reset } = methods;

  const { data: eventsData, isLoading: eventsLoading } = useGetEvents();

  const { data: usersData, isLoading: usersLoading } = useGetAllUsers();

  const { mutate: createInvitation, isPending } = useCreateInvitationMutation();

  const eventOptions =
    eventsData?.data?.data?.map((event) => ({
      value: event.id,
      label: `${event.name} - ${parseToWIB(event.start_time)}`,
    })) || [];

  const userOptions =
    usersData?.data?.map((user) => ({
      value: user.id,
      label: `${user.name} (${user.email})`,
    })) || [];

  const onSubmit = (data: CreateInvitationRequest) => {
    createInvitation(data, {
      onSuccess: () => {
        setIsSubmitted(true);
        reset();
        toast.success("Undangan berhasil dikirim!");
      },
      onError: () => {
        toast.error("Gagal mengirim undangan. Silakan coba lagi.");
      },
    });
  };

  return (
    <section className="space-y-6">
      <div>
        <div className="">
          <BreadCrumbs breadcrumbs={breadCrumbs} />
        </div>
        <h1 className="text-2xl max-lg:text-xl font-semibold">
          Manajemen Undangan
        </h1>
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="mb-6">
          <h2 className="text-lg font-medium text-gray-900 mb-2">
            Kirim Undangan Event
          </h2>
          <p className="text-sm text-gray-600">
            Pilih event dan pengguna yang akan diundang
          </p>
        </div>

        {isSubmitted && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md">
            <div className="text-green-800">Undangan berhasil dikirim!</div>
          </div>
        )}

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-6">
              <div className="space-y-4">
                <SelectInput
                  id="event_id"
                  label="Pilih Event"
                  placeholder="Pilih event yang akan diundang"
                  options={eventOptions}
                  isMulti={false}
                  isLoading={eventsLoading}
                  isSearchable={true}
                  validation={{
                    required: "Event harus dipilih",
                  }}
                />

                <SelectInput
                  id="user_ids"
                  label="Pilih Pengguna"
                  placeholder="Pilih pengguna yang akan diundang"
                  options={userOptions}
                  isMulti={true}
                  isLoading={usersLoading}
                  isSearchable={true}
                  validation={{
                    required: "Minimal satu pengguna harus dipilih",
                    validate: (value: string[]) => {
                      if (!value || value.length === 0) {
                        return "Minimal satu pengguna harus dipilih";
                      }
                      return true;
                    },
                  }}
                />

                <div className="flex justify-end pt-4">
                  <Button
                    type="submit"
                    variant="primary"
                    className="w-fit whitespace-nowrap"
                    disabled={isPending}
                  >
                    {isPending ? "Mengirim..." : "Kirim Undangan"}
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </FormProvider>
      </div>
    </section>
  );
}
