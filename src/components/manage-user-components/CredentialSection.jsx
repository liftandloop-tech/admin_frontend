import React from "react";
import SectionTitle from "./SectionTitle";
import { InputField } from "./InputField";

const CredentialSection = ({ data, onChange, onGenerateUserId }) => {
  return (
    <section className="rounded-xl border border-gray-200 bg-gray-50 p-6">
      <SectionTitle label={{ category: "Credential", title: "User Details" }} />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium text-slate-600">
            User ID <span className="text-rose-500">*</span>
          </span>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={data.userId}
              onChange={onChange("userId")}
              placeholder="Enter or generate user id"
              className="flex-1 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 transition focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-100"
            />
            <button
              type="button"
              onClick={onGenerateUserId}
              className="rounded-full border border-gray-200 p-2 text-gray-500 transition hover:bg-gray-50 hover:text-gray-700"
              title="Generate User Id"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </button>
          </div>
        </div>
        <InputField
          label="Password"
          required
          value={data.password}
          onChange={onChange("password")}
          placeholder="Enter password"
        />
        <InputField
          label="User Name"
          required
          value={data.userName}
          onChange={onChange("userName")}
          placeholder="Enter user name"
        />
        <InputField
          label="Email"
          type="email"
          required
          value={data.email}
          onChange={onChange("email")}
          placeholder="Enter email address"
        />
        <InputField
          label="Contact"
          required
          value={data.contact}
          onChange={onChange("contact")}
          placeholder="Enter contact number"
        />
      </div>
    </section>
  );
};

export default CredentialSection;

