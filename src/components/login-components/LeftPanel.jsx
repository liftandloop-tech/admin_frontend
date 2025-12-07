import React from "react";

const LeftPanel = () => {
  return (
    <div className="w-[40%] bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 flex flex-col items-center justify-center p-8 relative overflow-hidden min-h-screen">
      {/* Logo Card */}
      <div className="bg-white rounded-lg p-4 shadow-sm mb-10 z-10 w-full max-w-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
          </div>
          <h1 className="text-lg font-semibold text-gray-800">
            Quick X POS System
          </h1>
        </div>
      </div>

      {/* Business Operations Section */}
      <div className="flex flex-col items-center mb-20 z-10">
        <div className="w-64 h-64 bg-blue-200/40 rounded-full flex items-center justify-center mb-6">
          <svg
            className="w-32 h-32 text-blue-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">
          Business Operations
        </h2>
        <p className="text-gray-700 text-center">
          Manage your restaurant efficiently
        </p>
      </div>

      {/* Feature Icons */}
      <div className="flex gap-12 z-10 mt-auto mb-8">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 bg-white/80 rounded-lg flex items-center justify-center mb-2">
            <svg
              className="w-6 h-6 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          </div>
          <span className="text-sm text-gray-700 font-medium">Analytics</span>
        </div>

        <div className="flex flex-col items-center">
          <div className="w-12 h-12 bg-white/80 rounded-lg flex items-center justify-center mb-2">
            <svg
              className="w-6 h-6 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </div>
          <span className="text-sm text-gray-700 font-medium">Team</span>
        </div>

        <div className="flex flex-col items-center">
          <div className="w-12 h-12 bg-white/80 rounded-lg flex items-center justify-center mb-2">
            <svg
              className="w-6 h-6 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
              />
            </svg>
          </div>
          <span className="text-sm text-gray-700 font-medium">Payments</span>
        </div>
      </div>
    </div>
  );
};

export default LeftPanel;
