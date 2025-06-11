import clsxm from "@/lib/clsxm";
import * as React from "react";
import { RegisterOptions, get, useFormContext } from "react-hook-form";
import ErrorMessage from "./ErrorMessage";
import LabelText from "./LabelText";

export type TextAreaProps = {
  id: string;
  label?: string;
  helperText?: string;
  hideError?: boolean;
  validation?: RegisterOptions;
  containerClassName?: string;
} & React.ComponentPropsWithoutRef<"textarea">;

export default function TextArea({
  id,
  label,
  helperText,
  hideError = false,
  validation,
  className,
  containerClassName,
  maxLength = 1000,
  readOnly = false,
  ...rest
}: TextAreaProps) {
  const [value, setValue] = React.useState("");

  const {
    register,
    formState: { errors },
  } = useFormContext();

  const error = get(errors, id);
  const textArea = register(id, validation);

  const handleChange = (e: React.FormEvent<HTMLTextAreaElement>) => {
    textArea.onChange(e);
    setValue(e.currentTarget.value);
  };

  return (
    <div className={clsxm("w-full space-y-1.5", containerClassName)}>
      {label && (
        <LabelText required={validation?.required ? true : false}>
          {label}
        </LabelText>
      )}

      <div className="relative">
        <textarea
          {...textArea}
          id={id}
          name={id}
          readOnly={readOnly}
          disabled={readOnly}
          maxLength={maxLength}
          onChange={handleChange}
          className={clsxm(
            "h-full w-full rounded-md border border-gray-500 px-3 py-2.5 caret-gray-900",
            "focus:outline-1 focus:outline-gray-900 focus:ring-inset",
            "bg-slate-50 text-sm",
            "hover:ring-1 hover:ring-inset hover:ring-gray-900",
            "placeholder:text-sm placeholder:text-gray-500",
            "text-gray-900",
            readOnly && "cursor-not-allowed",
            error &&
              "border-none ring-2 ring-inset ring-red-500 bg-red-100 placeholder:text-gray-500 focus:ring-red-500",
            className,
          )}
          aria-describedby={id}
          {...rest}
        />
        <p className="absolute bottom-2.5 right-6 text-xs">
          {value.length}/{maxLength}
        </p>
      </div>
      {helperText && <h5 className="mt-1 text-base-secondary">{helperText}</h5>}
      {!hideError && error && (
        <ErrorMessage>{error.message?.toString()}</ErrorMessage>
      )}
    </div>
  );
}
