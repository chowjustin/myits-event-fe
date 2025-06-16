"use client";

import { boundingBox, Scanner } from "@yudiel/react-qr-scanner";
import * as React from "react";

import Button from "@/components/buttons/Button";
import toast from "react-hot-toast";
import withAuth from "@/components/hoc/withAuth";
import { usePresensiMutation } from "@/app/hooks/invitation/usePresensiMutation";

export default withAuth(Presensi, "ormawa");
function Presensi() {
  const [qrId, setQrId] = React.useState<string | null>(null);

  const { mutateAsync } = usePresensiMutation();

  const onScan = (id: string) => {
    setQrId(id);
  };

  React.useEffect(() => {
    if (qrId) {
      mutateAsync(qrId)
        .then(() => {
          toast.success("Berhasil menerima undangan!");
        })
        .catch(() => {
          toast.error("Gagal menerima undangan.");
        })
        .finally(() => {
          setQrId(null);
        });
    }
  }, [qrId, mutateAsync]);

  return (
    <section className="flex items-center flex-col gap-5">
      <h1 className="text-3xl font-semibold">Scan QR Code Peserta</h1>
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

      <Button onClick={() => setQrId(null)} variant="primary" className="w-fit">
        Reset
      </Button>
    </section>
  );
}
