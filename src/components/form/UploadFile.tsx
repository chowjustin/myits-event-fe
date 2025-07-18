"use client";

import * as React from "react";
import { Accept, FileRejection, useDropzone } from "react-dropzone";
import {
  Controller,
  RegisterOptions,
  get,
  useFormContext,
} from "react-hook-form";
import { HiOutlineArrowUpCircle } from "react-icons/hi2";

import useFileStore from "@/app/stores/useFileStore";
import Typography from "@/components/Typography";
import ErrorMessage from "@/components/form/ErrorMessage";
import HelperText from "@/components/form/HelperText";
import ImagePreviewCard from "@/components/image/ImagePreviewCard";
import clsxm from "@/lib/clsxm";
import { FileWithPreview } from "@/types/form/dropzone";

export type DropzoneInputProps = {
  id: string;
  label?: string;
  helperText?: string;
  hideError?: boolean;
  validation?: RegisterOptions;
  accept?: Accept;
  maxFiles?: number;
  disabled?: boolean;
  maxSize?: number;
  className?: string;
  onFileUpload?: (files: FileWithPreview[]) => void;

  onDrop?: any;
};

export default function UploadFile({
  id,
  label,
  helperText,
  hideError = false,
  validation,
  accept = {
    "image/*": [".jpg", ".jpeg", ".png"],
    "application/pdf": [".pdf"],
  },
  maxFiles = 1,
  maxSize = 1000000,
  className,
  disabled = false,
  onFileUpload,
}: DropzoneInputProps) {
  const {
    control,
    setValue,
    setError,
    clearErrors,
    formState: { errors },
  } = useFormContext();

  const error = get(errors, id);

  const dropzoneRef = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    if (error) {
      dropzoneRef.current?.focus();
    }
  }, [error]);

  const [files, setFiles] = React.useState<FileWithPreview[]>([]);

  const onDrop = React.useCallback(
    <T extends File>(acceptedFiles: T[], rejectedFiles: FileRejection[]) => {
      if (rejectedFiles.length > 0) {
        setError(id, {
          type: "manual",
          message:
            rejectedFiles[0].errors[0].code === "file-too-large"
              ? `File cannot exceed ${maxSize / 1000000} MB`
              : "Unsupported file type",
        });
        return;
      }

      const acceptedFilesPreview = acceptedFiles.map((file: T) =>
        Object.assign(file, { preview: URL.createObjectURL(file) }),
      );

      setFiles(acceptedFilesPreview.slice(0, maxFiles));
      setValue(id, acceptedFilesPreview.slice(0, maxFiles));
      clearErrors(id);

      if (onFileUpload) {
        onFileUpload(acceptedFilesPreview);
      }
    },
    [clearErrors, maxFiles, maxSize, setError, setValue, id],
  );

  const { setIsFileDeleted } = useFileStore();

  const onDelete = (index: number) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);
    setValue(id, updatedFiles);
    setIsFileDeleted(true);
  };

  React.useEffect(() => {
    return () => {
      files.forEach((file) => URL.revokeObjectURL(file.preview));
    };
  }, [files]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept,
    maxFiles,
    maxSize,
  });

  return (
    <div className="w-full space-y-1.5 rounded-md">
      {label && (
        <label htmlFor={id} className="flex space-x-1">
          <Typography className="text-sm text-gray-900">{label}</Typography>
          {validation?.required && (
            <Typography className="text-sm text-red-500">*</Typography>
          )}
        </label>
      )}

      {files.length < maxFiles && (
        <Controller
          control={control}
          name={id}
          rules={validation}
          render={({ field: { onChange } }) => (
            <div
              ref={dropzoneRef}
              className="group focus:outline-none"
              {...getRootProps()}
            >
              <input
                {...getInputProps({
                  onChange: (e) => {
                    onChange(e.target.files);
                  },
                })}
              />
              <div
                className={clsxm(
                  "w-full cursor-pointer rounded-md bg-typo-white",
                  "flex flex-col items-center space-y-[6px] p-9",
                  "border-2 border-dashed border-typo-secondary",
                  error
                    ? "border-danger-main hover:border-danger-hover group-focus:border-danger-active"
                    : "group-hover:border-typo-main group-focus:border-typo-main",
                  disabled && "cursor-not-allowed opacity-50",
                  className,
                )}
              >
                <div className="flex flex-row items-center gap-[6px]">
                  <Typography className="text-center text-sm text-typo-secondary">
                    <HiOutlineArrowUpCircle />
                  </Typography>
                  <Typography className="text-center text-typo-secondary">
                    Drag and drop file
                  </Typography>
                </div>
                <Typography className="text-center text-typo-secondary">
                  Or
                </Typography>
                <div className="rounded-xl border border-primary px-4 py-3">
                  <Typography className="text-center font-semibold text-primary">
                    Upload from Computer
                  </Typography>
                </div>
              </div>
            </div>
          )}
        />
      )}

      {files.length > 0 &&
        files.map((file, index) => (
          <ImagePreviewCard
            key={index}
            imgPath={file.preview}
            label={file.name}
            onDelete={() => onDelete(index)}
            isLoading={false}
          />
        ))}

      {!hideError && error && <ErrorMessage>{error.message}</ErrorMessage>}
      {!error && helperText && <HelperText>{helperText}</HelperText>}
    </div>
  );
}
