import React from "react";

const SectionTitle = ({ label }) => (
  <div className="mb-5 flex items-center justify-between">
    <div>
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">
        {label.category}
      </p>
      <h2 className="text-lg font-semibold text-slate-900">{label.title}</h2>
    </div>
    {label.badge && (
      <span className="rounded-full bg-slate-100 px-4 py-1 text-xs font-semibold text-slate-500">
        {label.badge}
      </span>
    )}
  </div>
);

export default SectionTitle;

