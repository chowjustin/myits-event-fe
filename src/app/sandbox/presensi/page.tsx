"use client";

import { boundingBox, Scanner } from "@yudiel/react-qr-scanner";
import * as React from "react";

import Button from "@/components/buttons/Button";
import toast from "react-hot-toast";

export default function Presensi() {
  const [ticketId, setTicketId] = React.useState<string | null>(null);

  const onScan = (id: string) => {
    setTicketId(id);
    toast.success(`Ticket ID: ${id}`);
  };

  //   React.useEffect(() => {
  //     if (ticketId) {
  //       mutateAsync(ticketId).then(() => {
  //         setTicketId(null);
  //       });
  //     }
  //   }, [ticketId, mutateAsync]);

  return (
    <section className="flex flex-col px-6 py-10 md:px-14 md:py-20">
      <div className="mt-6 flex w-full flex-col items-center justify-center gap-7 md:mt-16 md:gap-12">
        <div className="overflow-hidden rounded-xl md:size-[554px]">
          <Scanner
            onScan={(result) => {
              onScan(result[0].rawValue);
            }}
            allowMultiple={true}
            components={{
              torch: true,
              zoom: true,
              finder: true,
              tracker: boundingBox,
            }}
          />
        </div>

        <Button
          onClick={() => setTicketId(null)}
          variant="primary"
          className="w-full"
        >
          Reset
        </Button>
      </div>
    </section>
  );
}
