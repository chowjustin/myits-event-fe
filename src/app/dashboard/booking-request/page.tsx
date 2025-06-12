"use client";

import { useForm, FormProvider } from "react-hook-form";
import BreadCrumbs from "@/components/BreadCrumbs";
import SelectInput from "@/components/form/SelectInput";
import Button from "@/components/buttons/Button";
import useGetEvents from "@/app/hooks/event/useGetEvents";
import { parseToWIB } from "@/utils/parseToWib";
import toast from "react-hot-toast";
import withAuth from "@/components/hoc/withAuth";
import { useCreateBookingReqMutation } from "@/app/hooks/booking-request/useCreateBookingReqMutation";
import { CreateBookingRequest } from "@/types/booking-request";
import useGetAllRooms from "@/app/hooks/room/useGetAllRooms";

const breadCrumbs = [
  { href: "/dashboard", Title: "Dashboard" },
  { href: `/dashboard/booking-request`, Title: "Permintaan Booking" },
];

export default withAuth(Invitation, "ormawa");
function Invitation() {
  const methods = useForm<CreateBookingRequest>({
    defaultValues: {
      event_id: "",
      room_ids: [],
    },
  });

  const { handleSubmit, reset } = methods;

  const { data: eventsData, isLoading: eventsLoading } = useGetEvents();

  const { data: roomsData, isLoading: roomsLoading } = useGetAllRooms();

  const { mutate: createBookingRequest, isPending } =
    useCreateBookingReqMutation();

  const eventOptions =
    eventsData?.data?.data?.map((event) => ({
      value: event.id,
      label: `${event.name} - ${parseToWIB(event.start_time)}`,
    })) || [];

  const roomOptions = Array.isArray(roomsData?.data)
    ? roomsData.data.map((room) => ({
        value: room.id,
        label: room.name,
      }))
    : [];

  const onSubmit = (data: CreateBookingRequest) => {
    createBookingRequest(data, {
      onSuccess: () => {
        reset();
        toast.success("Permintaan booking berhasil dikirim!");
      },
      onError: () => {
        toast.error("Gagal mengirim permintaan booking. Silakan coba lagi.");
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
          Permintaan Booking Ruangan
        </h1>
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="mb-6">
          <h2 className="text-lg font-medium text-gray-900 mb-2">
            Buat Permintaan Booking Ruangan
          </h2>
          <p className="text-sm text-gray-600">
            Pilih event dan ruangan yang akan digunakan
          </p>
        </div>

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
                  id="room_ids"
                  label="Pilih Ruangan"
                  placeholder="Pilih ruangan yang akan digunakan"
                  options={roomOptions}
                  isMulti={true}
                  isLoading={roomsLoading}
                  isSearchable={true}
                  validation={{
                    required: "Minimal satu ruangan harus dipilih",
                    validate: (value: string[]) => {
                      if (!value || value.length === 0) {
                        return "Minimal satu ruangan harus dipilih";
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
                    {isPending ? "Mengirim..." : "Kirim Permintaan Booking"}
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
