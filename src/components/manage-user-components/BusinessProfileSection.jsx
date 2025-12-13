import React from "react";
import SectionTitle from "./SectionTitle";
import { InputField, SelectField } from "./InputField";

const BusinessProfileSection = ({ data, onChange, categories = [] }) => {
  // Transform categories for dropdown
  const categoryOptions = categories.map(cat => cat.name || cat);
  return (
    <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <SectionTitle
        label={{ category: "Business Profile"}}
      />
      <div className="grid gap-6 md:grid-cols-2">
        <InputField
          label="Salon Name"
          required
          value={data.salonName}
          onChange={onChange("salonName")}
          placeholder="Enter salon name"
        />
        <SelectField
          label="Business Category"
          value={data.businessCategory}
          onChange={onChange("businessCategory")}
          options={categoryOptions.length > 0 ? categoryOptions : ["Salon POS", "Restaurant POS"]}
          placeholder="Select business category (optional)"
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
        <SelectField
          label="Gender"
          value={data.gender}
          onChange={onChange("gender")}
          options={["", "male", "female", "other"]}
          placeholder="Select gender (optional)"
        />
        <InputField
          label="Date of Birth"
          type="date"
          value={data.dateOfBirth}
          onChange={onChange("dateOfBirth")}
          placeholder="Select date of birth (optional)"
        />
      </div>
    </section>
  );
};

export default BusinessProfileSection;

