import React from "react";

export default function ChallengeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#FFF9C4] to-[#C8E6C9] text-gray-800 overflow-y-auto">
      {/* Macaron Theme: Tender Yellow (yellow-100/200) to Tender Green (green-100/200) */}
      <div className="max-w-md mx-auto min-h-screen flex flex-col">
        {children}
      </div>
    </div>
  );
}
