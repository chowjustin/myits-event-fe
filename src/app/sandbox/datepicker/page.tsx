"use client";

import FormDatePicker from "@/components/form/DatePicker";
import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";

// Define your form data interface
interface EventFormData {
  start_time: Date | null;
  end_time: Date | null;
  registration_deadline: Date | null;
  event_name: string;
  meeting_time: Date | null;
  deadline_time: Date | null;
}

const EventForm: React.FC = () => {
  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EventFormData>({
    defaultValues: {
      start_time: null,
      end_time: null,
      registration_deadline: null,
      event_name: "",
      meeting_time: null,
      deadline_time: null,
    },
  });

  // Watch start_time to set minimum end_time
  const startTime = watch("start_time");
  const registrationDeadline = watch("registration_deadline");

  const onSubmit: SubmitHandler<EventFormData> = async (data) => {
    console.log("Form Data:", data);

    // Example: Process your form data here
    const processedData = {
      event_name: data.event_name,
      start_time: data.start_time?.toISOString(),
      end_time: data.end_time?.toISOString(),
      registration_deadline: data.registration_deadline?.toISOString(),
      meeting_time: data.meeting_time?.toISOString(),
      deadline_time: data.deadline_time?.toISOString(),
    };

    console.log("Processed Data:", processedData);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    alert("Event berhasil dibuat!");
  };

  const handleReset = () => {
    reset();
  };

  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  // Custom date filter to disable weekends (example)
  const isWeekday = (date: Date) => {
    const day = date.getDay();
    return day !== 0 && day !== 6; // 0 = Sunday, 6 = Saturday
  };

  // Custom time filter to only allow business hours (9 AM - 6 PM)
  const isBusinessHours = (time: Date) => {
    const hours = time.getHours();
    return hours >= 9 && hours <= 18;
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Buat Event Baru</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Event Name */}
          <div className="md:col-span-2">
            <label
              htmlFor="event_name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Nama Event <span className="text-red-500">*</span>
            </label>
            <input
              id="event_name"
              type="text"
              {...control.register("event_name", {
                required: "Nama event wajib diisi!",
                minLength: {
                  value: 3,
                  message: "Nama event minimal 3 karakter",
                },
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Masukkan nama event"
            />
            {errors.event_name && (
              <div className="text-red-500 text-sm mt-1">
                {errors.event_name.message}
              </div>
            )}
          </div>

          {/* Start Time - Full DateTime Picker */}
          <FormDatePicker
            id="start_time"
            control={control}
            label="Tanggal & Waktu Mulai Event"
            placeholder="Pilih tanggal dan waktu mulai"
            includeTime={true}
            timeIntervals={15}
            minDate={today}
            validation={{
              required: "Tanggal mulai event wajib diisi!",
            }}
          />

          {/* End Time - Full DateTime Picker with validation */}
          <FormDatePicker
            id="end_time"
            control={control}
            label="Tanggal & Waktu Selesai Event"
            placeholder="Pilih tanggal dan waktu selesai"
            includeTime={true}
            timeIntervals={15}
            minDate={startTime || today}
            validation={{
              required: "Tanggal selesai event wajib diisi!",
              validate: (value) => {
                if (!startTime || !value) return true;
                return (
                  value > startTime || "Waktu selesai harus setelah waktu mulai"
                );
              },
            }}
          />

          {/* Registration Deadline - Date Only */}
          <FormDatePicker
            id="registration_deadline"
            control={control}
            label="Batas Waktu Pendaftaran"
            placeholder="Pilih batas waktu pendaftaran"
            includeTime={false}
            minDate={today}
            maxDate={startTime || undefined}
            validation={{
              required: "Batas waktu pendaftaran wajib diisi!",
              validate: (value) => {
                if (!startTime || !value) return true;
                const startDate = new Date(
                  startTime.getFullYear(),
                  startTime.getMonth(),
                  startTime.getDate(),
                );
                // const deadlineDate = new Date(
                //   value.getFullYear(),
                //   value.getMonth(),
                //   value.getDate()
                // );
                // return (
                //   deadlineDate <= startDate ||
                //   "Batas pendaftaran harus sebelum atau sama dengan tanggal mulai event"
                // );
              },
            }}
          />

          {/* Meeting Time - Time Only Picker */}
          <FormDatePicker
            id="meeting_time"
            control={control}
            label="Waktu Meeting Persiapan"
            placeholder="Pilih waktu meeting"
            showTimeSelectOnly={true}
            timeIntervals={30}
            filterTime={isBusinessHours}
            validation={{
              required: "Waktu meeting wajib diisi!",
            }}
          />

          {/* Deadline Time - DateTime with business days filter */}
          <FormDatePicker
            id="deadline_time"
            control={control}
            label="Deadline Submission (Hari Kerja)"
            placeholder="Pilih deadline submission"
            includeTime={true}
            timeIntervals={60}
            minDate={today}
            filterDate={isWeekday}
            filterTime={isBusinessHours}
            validation={{
              required: "Deadline submission wajib diisi!",
            }}
          />
        </div>

        {/* Form Actions */}
        <div className="flex gap-4 pt-6 border-t">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Menyimpan...
              </span>
            ) : (
              "Buat Event"
            )}
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors font-medium"
          >
            Reset Form
          </button>

          <button
            type="button"
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors font-medium"
          >
            Batal
          </button>
        </div>

        {/* Debug Info */}
        <div className="mt-8 p-4 bg-gray-50 rounded-md">
          <h3 className="text-sm font-medium text-gray-700 mb-2">
            Form Values (Debug):
          </h3>
          <pre className="text-xs text-gray-600 overflow-auto">
            {JSON.stringify(watch(), null, 2)}
          </pre>
        </div>
      </form>
    </div>
  );
};

export default EventForm;
