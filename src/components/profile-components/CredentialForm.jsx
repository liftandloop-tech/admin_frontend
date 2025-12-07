import React, { useState } from 'react';

/**
 * CredentialForm Component
 * 
 * Form section for managing profile credentials with:
 * - Admin ID field (required)
 * - Password field (required) with eye icon (toggle visibility) and refresh icon (generate new password)
 * - Email field
 * - User Name field
 * - Contact field
 * - City field
 * 
 * Props:
 * @param {Object} formData - Current form data
 * @param {Function} onFormDataChange - Callback when form data changes
 * 
 * Features:
 * - Controlled form inputs
 * - Password visibility toggle
 * - Password generation functionality
 * - Form validation ready
 */
const CredentialForm = ({ formData, onFormDataChange, onSubmit, isLoading = false }) => {
  const [showPassword, setShowPassword] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedData = {
      ...formData,
      [name]: value
    };
    onFormDataChange(updatedData);
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Generate a new random password
  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let newPassword = '';
    for (let i = 0; i < 8; i++) {
      newPassword += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    const updatedData = {
      ...formData,
      password: newPassword
    };
    onFormDataChange(updatedData);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-6">Credential</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Admin ID Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Admin ID <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="adminId"
            value={formData.adminId}
            onChange={handleChange}
            className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        {/* Password Field with Icons */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 pr-20 text-sm text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
            <div className="absolute inset-y-0 right-0 flex items-center gap-1 pr-2">
              {/* Eye Icon - Toggle Password Visibility */}
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
              {/* Refresh Icon - Generate New Password */}
              <button
                type="button"
                onClick={generatePassword}
                className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
                title="Generate new password"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Email Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* User Name Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            User Name
          </label>
          <input
            type="text"
            name="userName"
            value={formData.userName}
            onChange={handleChange}
            className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Contact Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Contact
          </label>
          <input
            type="text"
            name="contact"
            value={formData.contact}
            onChange={handleChange}
            className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
          />
        </div>
      </div>
      
      {/* Submit Button */}
      <div className="mt-6 flex justify-end">
        <button
          type="button"
          onClick={onSubmit}
          disabled={isLoading}
          className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Updating..." : "Update Profile"}
        </button>
      </div>
    </div>
  );
};

export default CredentialForm;

