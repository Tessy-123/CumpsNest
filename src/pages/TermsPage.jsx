import React from 'react';

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 flex flex-col gap-6 pb-24 text-on-surface">
      <div className="flex flex-col gap-2">
        <h1 className="font-heading font-extrabold text-3xl text-primary tracking-tight">
          Terms of Service
        </h1>
        <p className="text-xs text-on-surface-variant">Last updated: October 2025</p>
      </div>

      <div className="prose prose-sm text-on-surface-variant flex flex-col gap-4 text-xs sm:text-sm leading-relaxed">
        <p>
          Welcome to CampusNest Malawi. By accessing or using our platform, you agree to comply with and be bound by these Terms of Service.
        </p>

        <h2 className="font-heading font-bold text-base text-on-surface mt-2">
          1. Zero Advance Booking Fees Mandate
        </h2>
        <p>
          Users must never pay or request advance booking or registration fees prior to an in-person room inspection. Any host found soliciting advance electronic transfers (via Airtel Money, Mpamba, or Bank Transfer) will be instantly banned.
        </p>

        <h2 className="font-heading font-bold text-base text-on-surface mt-2">
          2. Physical Room Inspection Responsibility
        </h2>
        <p>
          While CampusNest conducts rigorous spot-checks, physical verification of water pressure, electrical wiring, and room keys must be completed by the student before signing any lease agreement or transferring security deposits.
        </p>

        <h2 className="font-heading font-bold text-base text-on-surface mt-2">
          3. Limitation of Liability
        </h2>
        <p>
          CampusNest facilitates discovery and verified scheduling between students and independent landlords. CampusNest is not a party to lease agreements and does not own the listed accommodation units.
        </p>
      </div>
    </div>
  );
}
