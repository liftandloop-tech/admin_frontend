import React from "react";
import SectionTitle from "./SectionTitle";
import { InputField, SelectField } from "./InputField";

const BusinessProfileSection = ({ data, onChange, categories = [] }) => {
  // Transform categories for dropdown
  const categoryOptions = categories.map(cat => cat.name || cat);
  return (
    <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <SectionTitle
        label={{ category: "Business Profile", title: "Company Snapshot" }}
      />
      <div className="grid gap-6 md:grid-cols-2">
        <InputField
          label="Business Name"
          required
          value={data.businessName}
          onChange={onChange("businessName")}
          placeholder="Enter business name"
        />
        <SelectField
          label="Business Category"
          required
          value={data.businessCategory}
          onChange={onChange("businessCategory")}
          options={categoryOptions.length > 0 ? categoryOptions : ["Salon POS", "Restaurant POS"]}
          placeholder="Select business category"
        />
        <InputField
          label="Salon Address"
          required
          value={data.salonAddress}
          onChange={onChange("salonAddress")}
          placeholder="Enter salon address"
        />
        <InputField
          label="GSTIN"
          value={data.gstin}
          onChange={onChange("gstin")}
          placeholder="Enter GSTIN (optional)"
        />
      </div>
    </section>
  );
};

export default BusinessProfileSection;

