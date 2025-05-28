import { ReactNode } from "react";
import clsxm from "@/lib/clsxm";

export default function LabelText({
  children,
  labelTextClasname,
  required,
}: {
  children: ReactNode;
  labelTextClasname?: string;
  required?: boolean;
}) {
  return (
    <label
      className={clsxm("text-md font-bold text-gray-900", labelTextClasname)}
    >
      {children} {required && <span className="text-red-500">*</span>}
    </label>
  );
}
