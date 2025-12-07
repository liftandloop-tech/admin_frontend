import React from "react";

const FormActions = ({ isLoading = false }) => {
  return (
    <div className="flex flex-col items-center justify-between gap-4 rounded-xl border border-dashed border-gray-200 bg-gray-50 px-6 py-5 text-sm text-slate-500 md:flex-row">
      <p>
        Review all fields before saving. These settings control the user's
        access and billing window.
      </p>
      <button
        type="submit"
        disabled={isLoading}
        className="inline-flex items-center gap-2 rounded-2xl bg-indigo-600 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span className="text-lg">📄</span> {isLoading ? "Saving..." : "Save"}
      </button>
    </div>
  );
};

export default FormActions;

