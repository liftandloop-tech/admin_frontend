import React from "react";
import SectionTitle from "./SectionTitle";
import { InputField } from "./InputField";

const LicenseSection = ({ data, onChange, onGenerate }) => {
  return (
    <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <SectionTitle
        label={{
          category: "Generate Licence Key",
          title: "Secure Access",
        }}
      />
      <div className="flex flex-col gap-4 md:flex-row justify-end">
        <div className="flex-1">
          <InputField
            label="Licence Key"
            value={data.licenseKey}
            onChange={onChange("licenseKey")}
            placeholder="Generate a licence key"
          />
        </div>
        <button
          type="button"
          onClick={onGenerate}
          className="flex items-center self-end h-fit justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:bg-indigo-500"
        >
          <span className="text-lg">↻</span> Generate
        </button>
      </div>
    </section>
  );
};

export default LicenseSection;

