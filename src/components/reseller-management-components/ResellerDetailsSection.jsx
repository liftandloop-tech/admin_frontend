import React, { useState } from "react";
import { useCreateResellerMutation, useUpdateResellerMutation } from "../../store/api/endpoints/resellerApi";
import { formatPhoneInput, normalizePhoneNumber, isValidEmail, isValidPhoneNumber } from "../../utils/validation";

/**
 * ResellerDetailsSection Component
 * 
 * Form section for adding/editing reseller information with:
 * - Reseller Name field
 * - Email field
 * - Contact field
 * - Password field (required)
 * - Save button
 * 
 * Features:
 * - Controlled form inputs
 * - Form validation
 */
const ResellerDetailsSection = ({ onNotify, editingReseller = null, onEditComplete = null }) => {
  // Normalize phone number for display (remove +91 prefix if present)
  const getDisplayContact = (contact) => {
    if (!contact) return "";
    return normalizePhoneNumber(contact);
  };

  const [formData, setFormData] = useState({
    // Required fields matching Reseller schema
    name: editingReseller?.name || "",
    email: editingReseller?.email || "",
    contact: getDisplayContact(editingReseller?.contact),
    password: "",
    // Optional fields from Reseller schema
    address: editingReseller?.address || "",
    city: editingReseller?.city || "",
  });

  const [createReseller, { isLoading: isCreating }] = useCreateResellerMutation();
  const [updateReseller, { isLoading: isUpdating }] = useUpdateResellerMutation();

  const isLoading = isCreating || isUpdating;

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Format phone number input if it's the contact field
    if (name === 'contact') {
      const formatted = formatPhoneInput(value);
      setFormData((prev) => ({
        ...prev,
        [name]: formatted,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Handle form submission
  const handleSave = async () => {
    // Validation - match backend Reseller schema requirements
    if (!editingReseller) {
      if (!formData.name || !formData.email || !formData.contact || !formData.password) {
        onNotify?.("Please fill in all required fields (Name, Email, Contact, Password)");
        return;
      }
      
      // Validate email format
      if (!isValidEmail(formData.email)) {
        onNotify?.("Please enter a valid email address");
        return;
      }
      
      // Validate phone number
      if (!isValidPhoneNumber(formData.contact)) {
        onNotify?.("Contact number must be exactly 10 digits");
        return;
      }
    } else {
      // Validation for update
      if (!formData.name || !formData.contact) {
        onNotify?.("Please fill in all required fields (Name, Contact)");
        return;
      }
      
      // Validate phone number
      if (!isValidPhoneNumber(formData.contact)) {
        onNotify?.("Contact number must be exactly 10 digits");
        return;
      }
    }

    try {
      if (editingReseller) {
        // Update existing reseller - match backend Reseller schema
        const updateData = {
          name: formData.name,
          contact: formData.contact,
          address: formData.address || undefined,
          city: formData.city || undefined,
        };
        if (formData.password) {
          updateData.password = formData.password;
        }
        
        await updateReseller({ id: editingReseller._id || editingReseller.id, ...updateData }).unwrap();
        onNotify?.(`Reseller updated successfully`);
        onEditComplete?.();
      } else {
        // Create new reseller - match backend Reseller schema
        await createReseller({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          contact: formData.contact,
          address: formData.address || undefined,
          city: formData.city || undefined,
        }).unwrap();
        onNotify?.(`Reseller created successfully`);
      }
      
      // Reset form
      setFormData({
        name: "",
        email: "",
        contact: "",
        password: "",
        address: "",
        city: "",
      });
    } catch (error) {
      const errorMessage = error?.data?.message || error?.message || "Failed to save reseller";
      onNotify?.(errorMessage);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Reseller Details</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Reseller Name Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Reseller Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter reseller name"
            required
          />
        </div>

        {/* Email Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            placeholder="Enter email address"
            required={!editingReseller}
            disabled={!!editingReseller}
          />
          {formData.email && !isValidEmail(formData.email) && (
            <p className="mt-1 text-xs text-red-500">Please enter a valid email address</p>
          )}
        </div>

        {/* Contact Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Contact <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            name="contact"
            value={formData.contact}
            onChange={handleChange}
            className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter 10-digit contact number"
            maxLength={10}
            required
          />
          {formData.contact && !isValidPhoneNumber(formData.contact) && (
            <p className="mt-1 text-xs text-red-500">Contact number must be exactly 10 digits</p>
          )}
          {formData.contact && isValidPhoneNumber(formData.contact) && (
            <p className="mt-1 text-xs text-gray-500">Will be saved as +91{formData.contact}</p>
          )}
        </div>

        {/* Address Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Address
          </label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter address (optional)"
          />
        </div>

        {/* City Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            City
          </label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter city (optional)"
          />
        </div>

        {/* Password Field with Save Button */}
        <div className="flex items-end gap-2 md:col-span-3">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password {!editingReseller && <span className="text-red-500">*</span>}
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder={editingReseller ? "Enter new password (optional)" : "Enter password"}
              required={!editingReseller}
            />
          </div>
          <button
            type="button"
            onClick={handleSave}
            disabled={isLoading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (editingReseller ? "Updating..." : "Creating...") : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResellerDetailsSection;

