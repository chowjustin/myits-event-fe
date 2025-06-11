import { forwardRef } from "react";
import {
  useController,
  Control,
  FieldValues,
  Path,
  RegisterOptions,
} from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface FormDatePickerProps<T extends FieldValues> {
  id: Path<T>;
  label?: string;
  placeholder?: string;
  validation?: RegisterOptions<T>;
  control?: Control<T>;
  disabled?: boolean;
  className?: string;
  includeTime?: boolean;
  showTimeSelect?: boolean;
  showTimeSelectOnly?: boolean;
  timeFormat?: string;
  timeIntervals?: number;
  dateFormat?: string;
  minDate?: Date;
  maxDate?: Date;
  filterDate?: (date: Date) => boolean;
  filterTime?: (time: Date) => boolean;
  errorClassName?: string;
  labelClassName?: string;
  inputClassName?: string;
  calendarClassName?: string;
  locale?: string;
  isClearable?: boolean;
  autoComplete?: string;
}

// Custom input component for better styling integration
const CustomInput = forwardRef<HTMLInputElement, any>(
  (
    {
      value,
      onClick,
      onChange,
      onBlur,
      placeholder,
      className,
      disabled,
      id,
      ...props
    },
    ref,
  ) => (
    <input
      ref={ref}
      id={id}
      type="text"
      value={value || ""}
      onClick={onClick}
      onChange={onChange}
      onBlur={onBlur}
      placeholder={placeholder}
      className={className}
      disabled={disabled}
      readOnly
      {...props}
    />
  ),
);

CustomInput.displayName = "CustomInput";

const FormDatePicker = <T extends FieldValues>({
  id,
  label,
  placeholder = "Pilih tanggal",
  validation,
  control,
  disabled = false,
  className = "",
  includeTime = false,
  showTimeSelect = false,
  showTimeSelectOnly = false,
  timeFormat = "HH:mm",
  timeIntervals = 15,
  dateFormat,
  minDate,
  maxDate,
  filterDate,
  filterTime,
  errorClassName = "text-red-500 text-sm mt-1",
  labelClassName = "block text-sm font-medium text-gray-700 mb-1",
  inputClassName = "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed",
  calendarClassName = "",
  locale = "id",
  isClearable = true,
  autoComplete = "off",
}: FormDatePickerProps<T>) => {
  const {
    field: { onChange, onBlur, value, ref },
    fieldState: { error },
  } = useController({
    name: id,
    control,
    rules: validation,
    defaultValue: null as any,
  });

  // Determine date format based on options
  const getDateFormat = (): string => {
    if (dateFormat) return dateFormat;

    if (showTimeSelectOnly) return timeFormat;
    if (includeTime || showTimeSelect) return `dd/MM/yyyy ${timeFormat}`;
    return "dd/MM/yyyy";
  };

  const getDateValue = (): Date | null => {
    if (!value) return null;

    const val = value as unknown; // or value as any
    if (val instanceof Date) return val;

    const date = new Date(val as string);
    return isNaN(date.getTime()) ? null : date;
  };

  const handleChange = (date: Date | null) => {
    onChange(date);
  };

  const handleBlur = () => {
    onBlur();
  };

  return (
    <div className={`form-datepicker ${className}`}>
      {label && (
        <label htmlFor={id} className={labelClassName}>
          {label}
          {validation?.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        <DatePicker
          selected={getDateValue()}
          onChange={handleChange}
          onBlur={handleBlur}
          showTimeSelect={includeTime || showTimeSelect}
          showTimeSelectOnly={showTimeSelectOnly}
          timeFormat={timeFormat}
          timeIntervals={timeIntervals}
          dateFormat={getDateFormat()}
          minDate={minDate}
          maxDate={maxDate}
          filterDate={filterDate}
          filterTime={filterTime}
          disabled={disabled}
          isClearable={isClearable}
          placeholderText={placeholder}
          autoComplete={autoComplete}
          className={`${inputClassName} ${
            error
              ? "border-red-500 focus:ring-red-500 focus:border-red-500"
              : ""
          }`}
          calendarClassName={`shadow-lg border rounded-md ${calendarClassName}`}
          customInput={
            <CustomInput
              id={id}
              className={`${inputClassName} ${
                error
                  ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                  : ""
              }`}
              disabled={disabled}
              placeholder={placeholder}
            />
          }
          popperClassName="z-50"
          popperPlacement="bottom-start"
          showPopperArrow={false}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={error ? `${id}-error` : undefined}
        />
      </div>

      {error && (
        <div id={`${id}-error`} className={errorClassName} role="alert">
          {error.message}
        </div>
      )}

      <style jsx global>{`
        .react-datepicker-wrapper {
          width: 100%;
        }

        .react-datepicker__input-container {
          width: 100%;
        }

        .react-datepicker {
          font-family: inherit;
          border: 1px solid #d1d5db;
          border-radius: 0.375rem;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
            0 4px 6px -2px rgba(0, 0, 0, 0.05);
        }

        .react-datepicker__header {
          background-color: #f9fafb;
          border-bottom: 1px solid #e5e7eb;
          border-radius: 0.375rem 0.375rem 0 0;
        }

        .react-datepicker__current-month {
          font-weight: 600;
          color: #374151;
        }

        .react-datepicker__day-name {
          color: #6b7280;
          font-weight: 500;
        }

        .react-datepicker__day {
          border-radius: 0.25rem;
          transition: all 0.15s ease-in-out;
        }

        .react-datepicker__day:hover {
          background-color: #dbeafe;
          color: #1d4ed8;
        }

        .react-datepicker__day--selected {
          background-color: #3b82f6 !important;
          color: white !important;
        }

        .react-datepicker__day--selected:hover {
          background-color: #2563eb !important;
        }

        .react-datepicker__day--keyboard-selected {
          background-color: #dbeafe;
          color: #1d4ed8;
        }

        .react-datepicker__day--today {
          font-weight: 600;
          color: #dc2626;
        }

        .react-datepicker__time-container {
          border-left: 1px solid #e5e7eb;
        }

        .react-datepicker__time-list-item {
          transition: all 0.15s ease-in-out;
        }

        .react-datepicker__time-list-item:hover {
          background-color: #f3f4f6;
        }

        .react-datepicker__time-list-item--selected {
          background-color: #3b82f6 !important;
          color: white !important;
        }

        .react-datepicker__close-icon::after {
          background-color: #6b7280;
          border-radius: 50%;
          height: 16px;
          width: 16px;
          padding: 0;
          cursor: pointer;
          transition: background-color 0.15s ease-in-out;
        }

        .react-datepicker__close-icon::after:hover {
          background-color: #374151;
        }
      `}</style>
    </div>
  );
};

export default FormDatePicker;
