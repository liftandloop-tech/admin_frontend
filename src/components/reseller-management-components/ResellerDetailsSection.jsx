import React, { useState } from "react";
import { useCreateResellerMutation, useUpdateResellerMutation } from "../../store/api/endpoints/resellerApi";

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
  const [formData, setFormData] = useState({
    resellerName: editingReseller?.name || "",
    email: editingReseller?.email || "",
    contact: editingReseller?.contact || "",
    password: "",
  });

  const [createReseller, { isLoading: isCreating }] = useCreateResellerMutation();
  const [updateReseller, { isLoading: isUpdating }] = useUpdateResellerMutation();

  const isLoading = isCreating || isUpdating;

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSave = async () => {
    // Validation for creation
    if (!editingReseller) {
      if (!formData.resellerName || !formData.email || !formData.contact || !formData.password) {
        onNotify?.("Please fill in all required fields");
        return;
      }
    } else {
      // Validation for update
      if (!formData.resellerName || !formData.contact) {
        onNotify?.("Please fill in all required fields");
        return;
      }
    }

    try {
      if (editingReseller) {
        // Update existing reseller
        const updateData = {
          name: formData.resellerName,
          contact: formData.contact,
        };
        if (formData.password) {
          updateData.password = formData.password;
        }
        
        await updateReseller({ id: editingReseller._id || editingReseller.id, ...updateData }).unwrap();
        onNotify?.(`Reseller updated successfully`);
        onEditComplete?.();
      } else {
        // Create new reseller
        await createReseller({
          name: formData.resellerName,
          email: formData.email,
          password: formData.password,
          contact: formData.contact,
        }).unwrap();
        onNotify?.(`Reseller created successfully`);
      }
      
      // Reset form
      setFormData({
        resellerName: "",
        email: "",
        contact: "",
        password: "",
      });
    } catch (error) {
      const errorMessage = error?.data?.message || error?.message || "Failed to save reseller";
      onNotify?.(errorMessage);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Reseller Details</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Reseller Name Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Reseller Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="resellerName"
            value={formData.resellerName}
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
        </div>

        {/* Contact Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Contact <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="contact"
            value={formData.contact}
            onChange={handleChange}
            className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter contact number"
            required
          />
        </div>

        {/* Password Field with Save Button */}
        <div className="flex items-end gap-2">
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

