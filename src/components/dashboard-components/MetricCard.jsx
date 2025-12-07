import React from 'react';

/**
 * MetricCard Component
 * 
 * A reusable card component for displaying key metrics on the dashboard.
 * 
 * Props:
 * @param {ReactNode} icon - SVG icon component to display
 * @param {string} value - The metric value (e.g., "54", "1,283", "₹12.8L")
 * @param {string} label - The metric label (e.g., "Total Businesses")
 * @param {string} iconBgColor - Tailwind CSS background color class for icon container
 * 
 * Usage Example:
 * <MetricCard
 *   icon={<BuildingIcon />}
 *   value="54"
 *   label="Total Businesses"
 *   iconBgColor="bg-blue-100"
 * />
 * 
 * To customize:
 * - Change iconBgColor to match your color scheme
 * - Modify the card styling by updating Tailwind classes
 * - Add onClick handler if you want cards to be clickable
 */
const MetricCard = ({ icon, value, label, iconBgColor }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-lg ${iconBgColor} flex items-center justify-center flex-shrink-0`}>
        {icon}
      </div>
      <div className="flex-1">
        <p className="text-2xl font-semibold text-gray-800 mb-1">{value}</p>
        <p className="text-sm text-gray-600">{label}</p>
      </div>
    </div>
  );
};

export default MetricCard;

