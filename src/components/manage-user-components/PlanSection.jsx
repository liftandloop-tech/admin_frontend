import React from "react";
import SectionTitle from "./SectionTitle";
import { SelectField, InputField } from "./InputField";

const durationOptions = ["1 Month", "3 Months", "6 Months", "12 Months"];

const PlanSection = ({ data, onChange, plans = [] }) => {
  // Transform plans for dropdown
  const planOptions = plans.map(plan => plan.name || plan);
  return (
    <section className="rounded-xl border border-gray-200 bg-gray-50 p-6">
      <SectionTitle label={{ category: "Plan", title: "Subscription Setup" }} />
      <div className="grid gap-6 md:grid-cols-3">
        <SelectField
          label="Plan Type"
          required
          value={data.planType}
          onChange={onChange("planType")}
          options={planOptions.length > 0 ? planOptions : ["Basic", "Standard", "Premium"]}
          placeholder="Select plan"
        />
        <SelectField
          label="Duration"
          required
          value={data.duration}
          onChange={onChange("duration")}
          options={durationOptions}
          placeholder="Select duration"
        />
        <InputField
          label="Start Date"
          type="date"
          required
          value={data.startDate}
          onChange={onChange("startDate")}
          placeholder="Select start date"
        />
      </div>
    </section>
  );
};

export default PlanSection;

