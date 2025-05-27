import clsxm from "@/lib/clsxm";
import React, { useState } from "react";
import { FiChevronDown } from "react-icons/fi";
import Button from "./buttons/Button";

interface DropdownProps {
  sizes: string[];
  title: React.ReactNode;
  type: string;
  className?: string;
  link?: string[];
  withLink?: boolean;
  onFilterChange?: (selected: string[]) => void;
  onFormatChange?: (format: string) => void;
}

const Dropdown: React.FC<DropdownProps> = ({
  sizes,
  title,
  type,
  className,
  link = [],
  withLink = false,
  onFilterChange,
  onFormatChange,
}) => {
  const [selectedFilters, setSelectedFilters] = useState<string[]>(sizes);

  const handleOptionClick = (size: string) => {
    if (type === "base") {
      onFilterChange?.([size]);
      onFormatChange?.(size);

      const dropdownElement = document.getElementById("hs-dropdown-default");
      if (dropdownElement) {
        dropdownElement.click();
      }
    }
  };

  const handleCheckboxChange = (size: string) => {
    setSelectedFilters((prev) =>
      prev.includes(size)
        ? prev.filter((filter) => filter !== size)
        : [...prev, size],
    );
  };

  const handleSave = () => {
    if (onFilterChange) onFilterChange(selectedFilters);
    const dropdownElement = document.getElementById(
      "hs-dropdown-item-checkbox",
    );
    if (dropdownElement) dropdownElement.click();
  };

  const handleClear = () => {
    setSelectedFilters(sizes);
    if (onFilterChange) onFilterChange(sizes);

    const dropdownElement = document.getElementById(
      "hs-dropdown-item-checkbox",
    );
    if (dropdownElement) dropdownElement.click();
  };

  return type === "base" ? (
    <div className="hs-dropdown relative inline-flex justify-center items-center">
      <button
        id="hs-dropdown-default"
        type="button"
        className={clsxm(
          "hs-dropdown-toggle py-2 px-2 inline-flex items-center gap-x-2 min-w-[70%] text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none",
          `${className}`,
        )}
      >
        <p className="w-full text-center text-B3">{title}</p>
        <FiChevronDown />
      </button>

      <div
        className="hs-dropdown-menu transition-[opacity,margin] duration hs-dropdown-open:opacity-100 opacity-0 hidden bg-white shadow-md rounded-lg p-1 mt-2 after:h-4 after:absolute z-50 after:-bottom-4 after:start-0 after:w-full before:h-4 before:absolute before:start-0 before:w-full"
        aria-labelledby="hs-dropdown-default"
      >
        {sizes.map((size, index) =>
          withLink && link[index] ? (
            <a
              key={index}
              href={link[index]}
              className="flex items-center my-1 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
              rel="noopener noreferrer"
            >
              {size}
            </a>
          ) : (
            <div
              key={index}
              className="flex items-center my-1 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 cursor-pointer"
              onClick={() => handleOptionClick(size)}
            >
              {size}
            </div>
          ),
        )}
      </div>
    </div>
  ) : (
    <div className="m-1 hs-dropdown relative inline-flex [--auto-close:inside] z-50">
      <button
        id="hs-dropdown-item-checkbox"
        type="button"
        className="hs-dropdown-toggle py-2 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none"
      >
        <p className="w-full text-center text-B3">{title}</p>
        <FiChevronDown />
      </button>

      <div
        className={`hs-dropdown-menu relative transition-[opacity,margin] duration hs-dropdown-open:opacity-100 opacity-0 hidden min-w-60 bg-white  shadow-md rounded-lg p-2 ${className}`}
        aria-labelledby="hs-dropdown-item-checkbox"
      >
        {sizes.map((size, index) => (
          <div
            key={index}
            className="relative flex items-start my-1 py-2 px-3 rounded-lg hover:bg-gray-50"
          >
            <div className="flex justify-between items-center w-full">
              <p>{size}</p>
              <input
                id=""
                type="checkbox"
                name={size}
                checked={selectedFilters.includes(size)}
                onChange={() => handleCheckboxChange(size)}
                className="shrink-0 border-gray-200 rounded focus:ring-brand-500 disabled:opacity-50 disabled:pointer-events-none accent-brand-600"
              />
            </div>
          </div>
        ))}

        <div className="flex justify-end w-full mt-2 space-x-2">
          <Button size="sm" variant="outline" onClick={handleClear}>
            Reset
          </Button>
          <Button size="sm" onClick={handleSave}>
            Simpan
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Dropdown;
