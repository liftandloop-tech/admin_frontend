import React from "react";
import SectionTitle from "./SectionTitle";
import { InputField } from "./InputField";
import { normalizePhoneNumber, formatPhoneInput, isValidEmail, isValidPhoneNumber } from "../../utils/validation";

const CredentialSection = ({ data, onChange }) => {
  const handleEmailChange = (e) => {
    const value = e.target.value;
    onChange("email")(e);
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value;
    // Format input to only allow 10 digits
    const formatted = formatPhoneInput(value);
    // Create synthetic event with formatted value
    const syntheticEvent = {
      ...e,
      target: {
        ...e.target,
        value: formatted
      }
    };
    onChange("MobileNumber")(syntheticEvent);
  };

  // Normalize phone number for display (remove +91 prefix if present)
  const displayPhoneNumber = data.MobileNumber ? normalizePhoneNumber(data.MobileNumber) : '';

  return (
    <section className="rounded-xl border border-gray-200 bg-gray-50 p-6">
      <SectionTitle label={{ category: "Credential"}} />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <InputField
          label="Owner Name"
          required
          value={data.ownerName}
          onChange={onChange("ownerName")}
          placeholder="Enter owner name"
        />
        <div>
          <InputField
            label="Email"
            type="email"
            required
            value={data.email}
            onChange={handleEmailChange}
            placeholder="Enter email address"
          />
          {data.email && !isValidEmail(data.email) && (
            <p className="mt-1 text-xs text-red-500">Please enter a valid email address</p>
          )}
        </div>
        <div>
          <InputField
            label="Mobile Number"
            type="tel"
            required
            value={displayPhoneNumber}
            onChange={handlePhoneChange}
            placeholder="Enter 10-digit mobile number"
            maxLength={10}
          />
          {displayPhoneNumber && !isValidPhoneNumber(displayPhoneNumber) && (
            <p className="mt-1 text-xs text-red-500">Mobile number must be exactly 10 digits</p>
          )}
          {displayPhoneNumber && isValidPhoneNumber(displayPhoneNumber) && (
            <p className="mt-1 text-xs text-gray-500">Will be saved as +91{displayPhoneNumber}</p>
          )}
        </div>
        <InputField
          label="Password"
          type="password"
          required={!data.isEditMode}
          value={data.password}
          onChange={onChange("password")}
          placeholder={data.isEditMode ? "Enter new password (optional)" : "Enter password"}
        />
      </div>
    </section>
  );
};

export default CredentialSection;

