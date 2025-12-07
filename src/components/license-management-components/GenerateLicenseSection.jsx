import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useCreateLicenseMutation } from "../../store/api/endpoints/licenseApi";
import { useGetAllSalonsQuery, useGetResellerSalonsQuery } from "../../store/api/endpoints/userManagementApi";
import { useGetSubscriptionPlansQuery } from "../../store/api/endpoints/subscriptionApi";
import { selectRole } from "../../features/auth/authSlice";

/**
 * GenerateLicenseSection Component
 * 
 * Form section for generating new licenses with:
 * - All Users dropdown (pending salons shown first)
 * - Plan dropdown
 * - License Token field (prominent, can be manually entered)
 * - Generate button
 * 
 * Features:
 * - Controlled form inputs
 * - Pre-fill from pending requests
 * - Validation for existing licenses
 * - License token can be manually entered
 */
const GenerateLicenseSection = ({ onNotify, prefillData = null, onLicenseGenerated = null }) => {
  const role = useSelector(selectRole);
  const [allUsers, setAllUsers] = useState(prefillData?.salonId || "");
  const [plan, setPlan] = useState("");
  const [licenseToken, setLicenseToken] = useState(prefillData?.licenseToken || "");
  const [selectedSalon, setSelectedSalon] = useState(null);
  const [generatedLicense, setGeneratedLicense] = useState(null); // Store generated license key
  const [showLicenseModal, setShowLicenseModal] = useState(false); // Control modal visibility
  
  // Fetch salons - filter to show pending salons first
  // Use different endpoints based on role (though resellers shouldn't see this section)
  const { data: superAdminSalonsData, isLoading: isLoadingSuperAdmin } = useGetAllSalonsQuery({ 
    page: 1, 
    limit: 1000,
    status: "" // Get all to filter client-side
  }, {
    skip: role === 'reseller',
  });
  
  const { data: resellerSalonsData, isLoading: isLoadingReseller } = useGetResellerSalonsQuery({ 
    page: 1, 
    limit: 1000,
    status: "" // Get all to filter client-side
  }, {
    skip: role !== 'reseller',
  });
  
  // Use appropriate data based on role
  const salonsData = role === 'reseller' ? resellerSalonsData : superAdminSalonsData;
  const isLoadingSalons = role === 'reseller' ? isLoadingReseller : isLoadingSuperAdmin;
  
  // Separate pending and other salons
  const allSalons = salonsData?.salons || [];
  const pendingSalons = allSalons.filter(s => s.status?.toLowerCase() === 'pending');
  const otherSalons = allSalons.filter(s => s.status?.toLowerCase() !== 'pending');
  const salons = [...pendingSalons, ...otherSalons]; // Pending first
  
  // Fetch subscription plans for plan dropdown - skip for resellers (super-admin only)
  const { data: plansData, isLoading: isLoadingPlans } = useGetSubscriptionPlansQuery(
    { page: 1, limit: 100 },
    { skip: role === 'reseller' }
  );
  const plans = plansData?.plans || [];
  
  // License creation mutation
  const [createLicense, { isLoading: isCreating }] = useCreateLicenseMutation();

  // Handle prefill data
  useEffect(() => {
    if (prefillData) {
      setLicenseToken(prefillData.licenseToken || "");
      setAllUsers(prefillData.salonId || "");
      // Try to find salon if salons are loaded
      if (prefillData.salonId && salons.length > 0) {
        const salon = salons.find(s => s._id === prefillData.salonId || s.id === prefillData.salonId);
        if (salon) {
          setSelectedSalon(salon);
          // Use salon's licenseToken if available, otherwise keep prefillData token
          if (salon.licenseToken) {
            setLicenseToken(salon.licenseToken);
          }
        }
      }
    } else {
      // Reset form when prefillData is cleared
      setLicenseToken("");
      setAllUsers("");
      setSelectedSalon(null);
    }
  }, [prefillData]); // Only depend on prefillData

  // Update selected salon when salons load and we have prefillData
  useEffect(() => {
    if (prefillData?.salonId && salons.length > 0) {
      const salon = salons.find(s => s._id === prefillData.salonId || s.id === prefillData.salonId);
      if (salon && (!selectedSalon || selectedSalon._id !== salon._id)) {
        setSelectedSalon(salon);
        // Only update licenseToken if it's not already set or different
        if (salon.licenseToken && salon.licenseToken !== licenseToken) {
          setLicenseToken(salon.licenseToken);
        }
      }
    }
  }, [salons, prefillData?.salonId]); // Include salons but check for changes to prevent loops

  // Calculate duration in days from plan
  const getDurationDays = (planId) => {
    const selectedPlan = plans.find(p => p._id === planId || p.id === planId || p.name === planId);
    if (selectedPlan?.durationDays) {
      return selectedPlan.durationDays;
    }
    // Fallback to plan name parsing
    if (typeof planId === 'string') {
      if (planId.includes("3 Months") || planId === "3") return 90;
      if (planId.includes("6 Months") || planId === "6") return 180;
      if (planId.includes("12 Months") || planId === "12") return 365;
    }
    return 30; // default
  };

  // Handle form submission
  const handleGenerate = async () => {
    if (!licenseToken || !plan) {
      onNotify?.("Please fill in License Token and Plan fields");
      return;
    }

    // Find salon by license token if not already selected
    let salon = selectedSalon;
    if (!salon && licenseToken) {
      salon = salons.find(s => s.licenseToken === licenseToken);
      if (!salon) {
        // Allow manual entry - salon might not be in list yet
        onNotify?.("Warning: Salon not found in list. Proceeding with license token only.");
      }
    }

    try {
      const durationDays = getDurationDays(plan);
      const result = await createLicense({
        licenseToken: licenseToken,
        durationDays: durationDays,
      }).unwrap();

      // Debug: Log the full response
      console.log('License generation response:', result);

      // Extract license key from response
      // transformResponse now returns: { licenseKey, expiryDate, salon, ...licenseFields }
      const licenseKey = result?.licenseKey;
      const expiryDate = result?.expiryDate;
      
      // Get salon info from response or use the selected salon
      const salonInfo = result?.salon || salon;
      const salonName = salonInfo?.salonName || salonInfo?.ownerName || salon?.salonName || salon?.ownerName || 'User';
      
      console.log('Extracted values:', { licenseKey, expiryDate, salonName, fullResult: result });
      
      if (licenseKey) {
        // Store the generated license and show modal
        setGeneratedLicense({
          licenseKey: licenseKey,
          salonName: salonName,
          expiryDate: expiryDate
        });
        setShowLicenseModal(true);
      } else {
        // If license key not found, log for debugging
        console.error('License key not found in response. Full result:', result);
        onNotify?.('License generated but license key not found in response. Please check the console.');
      }

      onNotify?.(
        `License generated successfully${salon ? ` for ${salon.salonName || salon.ownerName}` : ''}${licenseKey ? `. License Key: ${licenseKey}` : ''}`
      );
      
      // Reset form
      setAllUsers("");
      setPlan("");
      setLicenseToken("");
      setSelectedSalon(null);
      
      // Notify parent component
      if (onLicenseGenerated) {
        onLicenseGenerated();
      }
    } catch (error) {
      // Handle case where license already exists (409 status)
      if (error?.status === 409 || error?.data?.success === false) {
        const existingLicense = error?.data?.data?.existingLicense || error?.data?.existingLicense;
        if (existingLicense?.licenseKey) {
          // Show existing license key in modal
          const salonInfo = salon;
          const salonName = salonInfo?.salonName || salonInfo?.ownerName || 'User';
          
          setGeneratedLicense({
            licenseKey: existingLicense.licenseKey,
            salonName: salonName,
            expiryDate: existingLicense.expiryDate,
            isExisting: true
          });
          setShowLicenseModal(true);
          
          onNotify?.(
            `This salon already has an active license. Showing existing license key.`
          );
          return;
        }
      }
      
      const errorMessage = error?.data?.message || error?.message || "Failed to generate license";
      onNotify?.(errorMessage);
    }
  };

  // Handle user selection
  const handleUserChange = (e) => {
    const value = e.target.value;
    setAllUsers(value);
    
    if (value) {
      const salon = salons.find(s => s._id === value || s.id === value || s.salonName === value);
      if (salon) {
        setSelectedSalon(salon);
        if (salon.licenseToken) {
          setLicenseToken(salon.licenseToken);
        }
      }
    } else {
      setSelectedSalon(null);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Generate Licence</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* All Users Dropdown - Pending salons shown first */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            All Users {pendingSalons.length > 0 && (
              <span className="ml-2 px-2 py-0.5 text-xs bg-yellow-100 text-yellow-800 rounded-full">
                {pendingSalons.length} pending
              </span>
            )}
          </label>
          <select
            value={allUsers}
            onChange={handleUserChange}
            disabled={isLoadingSalons}
            className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm text-gray-700 cursor-pointer hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <option value="">Select user (optional)</option>
            {pendingSalons.length > 0 && (
              <optgroup label="Pending Requests">
                {pendingSalons.map((salon, index) => (
                  <option key={salon._id || salon.id || `pending-${index}`} value={salon._id || salon.id}>
                    {salon.salonName} ({salon.ownerName}) - Pending
                  </option>
                ))}
              </optgroup>
            )}
            {otherSalons.length > 0 && (
              <optgroup label="Other Users">
                {otherSalons.map((salon, index) => (
                  <option key={salon._id || salon.id || `other-${index}`} value={salon._id || salon.id}>
                    {salon.salonName} ({salon.ownerName})
                  </option>
                ))}
              </optgroup>
            )}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none top-6">
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {/* Plan Dropdown */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">Plan <span className="text-red-500">*</span></label>
          <select
            value={plan}
            onChange={(e) => setPlan(e.target.value)}
            disabled={isLoadingPlans}
            className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm text-gray-700 cursor-pointer hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <option value="">Select plan</option>
            {plans.length > 0 ? (
              plans.map((planOption, index) => (
                <option key={planOption._id || planOption.id || `plan-${index}`} value={planOption._id || planOption.id}>
                  {planOption.name || planOption.planName} {planOption.durationDays ? `(${Math.floor(planOption.durationDays / 30)} Months)` : ''}
                </option>
              ))
            ) : (
              <>
                <option key="plan-3-months" value="3 Months">3 Months</option>
                <option key="plan-6-months" value="6 Months">6 Months</option>
                <option key="plan-12-months" value="12 Months">12 Months</option>
              </>
            )}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none top-6">
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {/* License Token Field - Prominent */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            License Token <span className="text-red-500">*</span>
            <span className="ml-2 text-xs text-gray-500 font-normal">(Enter manually or select user above)</span>
          </label>
          <div className="relative">
            <input
              type="text"
              value={licenseToken}
              onChange={(e) => setLicenseToken(e.target.value)}
              placeholder="Enter license token from registered user"
              className="w-full bg-white border-2 border-blue-300 rounded-lg px-4 py-2 pr-10 text-sm text-gray-700 hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            {licenseToken && (
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(licenseToken);
                  onNotify?.("License token copied to clipboard");
                }}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-blue-600 hover:text-blue-700"
                title="Copy to clipboard"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </button>
            )}
          </div>
          {selectedSalon && (
            <p className="mt-1 text-xs text-gray-500">
              Selected: {selectedSalon.salonName} ({selectedSalon.ownerName})
            </p>
          )}
        </div>
      </div>

      {/* Generate Button */}
      <div className="mt-6">
        <button
          type="button"
          onClick={handleGenerate}
          disabled={isCreating || isLoadingSalons || isLoadingPlans || !licenseToken || !plan}
          className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span>{isCreating ? "Generating..." : "Generate"}</span>
        </button>
        {/* Show helpful message if button is disabled due to missing fields */}
        {!isCreating && (!licenseToken || !plan) && (
          <p className="mt-2 text-xs text-gray-500">
            Please fill in both License Token and Plan fields to generate a license
          </p>
        )}
      </div>

      {/* License Key Modal */}
      {showLicenseModal && generatedLicense && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-800">
                {generatedLicense.isExisting ? "Existing License Found" : "License Generated Successfully"}
              </h3>
              <button
                onClick={() => {
                  setShowLicenseModal(false);
                  setGeneratedLicense(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {generatedLicense.isExisting && (
              <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  This salon already has an active license. Use the license key below to activate the account.
                </p>
              </div>
            )}
            
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">License for:</p>
              <p className="text-base font-medium text-gray-800">{generatedLicense.salonName}</p>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">License Key:</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={generatedLicense.licenseKey}
                  className="flex-1 px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm font-mono text-gray-800"
                />
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(generatedLicense.licenseKey);
                    onNotify?.("License key copied to clipboard!");
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  title="Copy license key"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>
            </div>

            {generatedLicense.expiryDate && (
              <div className="mb-4">
                <p className="text-sm text-gray-600">Expiry Date:</p>
                <p className="text-base font-medium text-gray-800">
                  {new Date(generatedLicense.expiryDate).toLocaleDateString('en-GB', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            )}

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowLicenseModal(false);
                  setGeneratedLicense(null);
                }}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GenerateLicenseSection;

