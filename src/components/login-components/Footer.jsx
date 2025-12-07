import React from "react";

const Footer = () => {
  return (
    <div className="w-full flex flex-col items-center gap-2 text-sm text-gray-600 pb-8 px-8">
      <p className="font-medium">Quick X POS • Version 2.1</p>
      <p>© 2025 Lift & Loop Technologies</p>
      <p className="text-xs text-center max-w-md">
        By continuing, you agree to our{" "}
        <a href="#" className="text-blue-600 hover:text-blue-700 underline">
          Terms of Use
        </a>{" "}
        and{" "}
        <a href="#" className="text-blue-600 hover:text-blue-700 underline">
          Privacy Policy
        </a>
        .
      </p>
    </div>
  );
};

export default Footer;
