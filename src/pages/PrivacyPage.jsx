import React from 'react';

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 flex flex-col gap-6 pb-24 text-on-surface">
      <div className="flex flex-col gap-2">
        <h1 className="font-heading font-extrabold text-3xl text-primary tracking-tight">
          Privacy Policy
        </h1>
        <p className="text-xs text-on-surface-variant">Last updated: October 2025</p>
      </div>

      <div className="prose prose-sm text-on-surface-variant flex flex-col gap-4 text-xs sm:text-sm leading-relaxed">
        <p>
          At CampusNest Malawi, protecting student confidentiality and personal physical security is foundational to our mission. This policy outlines how information is gathered and protected.
        </p>

        <h2 className="font-heading font-bold text-base text-on-surface mt-2">
          1. General Area Mapping (No Exact Private Gate Exposure)
        </h2>
        <p>
          To protect landlords and prevent unsolicited trespassing, CampusNest displays approximate campus perimeter zones (e.g. "Chikanda Village, ~650m from UNIMA Gate"). Precise gates and contact numbers are provided strictly after an authenticated viewing appointment is booked.
        </p>

        <h2 className="font-heading font-bold text-base text-on-surface mt-2">
          2. Student Contact & Verification Data
        </h2>
        <p>
          When you register with your student email or Malawian phone number (Airtel / TNM), we use it exclusively for sending walkthrough SMS confirmations, essential tenancy updates, and fraud alerts. We never sell or share your contact number with third-party advertisers.
        </p>

        <h2 className="font-heading font-bold text-base text-on-surface mt-2">
          3. Landlord National ID Records
        </h2>
        <p>
          Landlord National Registration Bureau (NRB) records and SIM verification hashes are stored in secure 256-bit encrypted vaults and accessed only during incident investigation by authorized campus security personnel.
        </p>
      </div>
    </div>
  );
}
