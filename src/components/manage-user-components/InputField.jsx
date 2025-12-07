import React from "react";

const baseClasses =
  "w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 transition focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-100";

const Label = ({ label, required }) => (
  <span className="text-sm font-medium text-slate-600">
    {label} {required && <span className="text-rose-500">*</span>}
  </span>
);

export const InputField = ({
  label,
  required,
  type = "text",
  value,
  onChange,
  placeholder,
  readOnly = false,
}) => {
  return (
    <label className="flex flex-col gap-2">
      <Label label={label} required={required} />
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        readOnly={readOnly}
        className={`${baseClasses} ${readOnly ? "cursor-not-allowed text-slate-500" : ""}`}
      />
    </label>
  );
};

export const SelectField = ({
  label,
  required,
  value,
  onChange,
  options = [],
}) => {
  return (
    <label className="flex flex-col gap-2">
      <Label label={label} required={required} />
      <div className="relative">
        <select
          value={value}
          onChange={onChange}
          className={`${baseClasses} appearance-none pr-10`}
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
          <svg
            className="h-4 w-4 text-slate-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>
    </label>
  );
};

