import React from "react";
import CredentialSection from "./CredentialSection";
import BusinessProfileSection from "./BusinessProfileSection";
import PlanSection from "./PlanSection";
import LicenseSection from "./LicenseSection";
import FormActions from "./FormActions";

const UserFormCard = ({
  formData,
  onChange,
  onGenerateUserId,
  onGenerateKey,
  onSubmit,
  isLoading = false,
  categories = [],
  plans = [],
}) => {
  return (
    <form
      onSubmit={onSubmit}
      className="space-y-6 rounded-2xl border border-gray-100 bg-white p-8 shadow-sm"
    >
      <CredentialSection
        data={formData}
        onChange={onChange}
        onGenerateUserId={onGenerateUserId}
      />
      <BusinessProfileSection data={formData} onChange={onChange} categories={categories} />
      <PlanSection data={formData} onChange={onChange} plans={plans} />
      <LicenseSection
        data={formData}
        onChange={onChange}
        onGenerate={onGenerateKey}
      />
      <FormActions isLoading={isLoading} />
    </form>
  );
};

export default UserFormCard;

