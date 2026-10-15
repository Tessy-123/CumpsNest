import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';

export default function SafetyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 flex flex-col gap-8 pb-24">
      <div className="flex flex-col gap-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed-variant w-fit text-xs font-bold uppercase tracking-wider">
          <span className="material-symbols-outlined text-[16px]">security</span>
          <span>Civic Safety Standard</span>
        </div>
        <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-primary tracking-tight">
          CampusNest Safety & Verification Standards
        </h1>
        <p className="font-sans text-sm sm:text-base text-on-surface-variant leading-relaxed">
          How we safeguard university students from rental fraud across Chancellor College (UNIMA), MUST, KUHeS, MUBAS, LUANAR, and MZUNI.
        </p>
      </div>

      {/* The 3 Golden Safety Rules */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/40 shadow-sm flex flex-col gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-error-container text-error flex items-center justify-center font-bold">
            <span className="material-symbols-outlined text-[22px]">payments</span>
          </div>
          <h2 className="font-heading font-bold text-base text-on-surface">
            1. Zero Advance Booking Fees
          </h2>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            Never send Airtel Money or Mpamba to secure a slot before a physical walkthrough. Verified landlords do not demand booking fees.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/40 shadow-sm flex flex-col gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
            <span className="material-symbols-outlined text-[22px]">directions_walk</span>
          </div>
          <h2 className="font-heading font-bold text-base text-on-surface">
            2. In-Person Walkthrough
          </h2>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            Always view the room in daylight. Test the water taps, examine the window burglar proofing, and check if backup solar lights function.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/40 shadow-sm flex flex-col gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-tertiary/10 text-tertiary flex items-center justify-center font-bold">
            <span className="material-symbols-outlined text-[22px]">description</span>
          </div>
          <h2 className="font-heading font-bold text-base text-on-surface">
            3. Signed Tenancy Receipt
          </h2>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            Only pay rent and deposit after signing a written agreement and obtaining a stamped receipt from the verified host.
          </p>
        </div>
      </div>

      {/* Verification Audit Breakdown */}
      <section className="bg-surface-container-low rounded-2xl p-6 border border-outline-variant/40 flex flex-col gap-4">
        <div className="flex items-center gap-2 text-primary">
          <span className="material-symbols-outlined text-[24px]">verified_user</span>
          <h2 className="font-heading font-bold text-lg sm:text-xl text-on-surface">
            What CampusNest Verifies (and What We Don't)
          </h2>
        </div>

        <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
          We take transparency seriously. To prevent false trust, we clearly disclose the exact bounds of our spot-audit process:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/30 flex flex-col gap-2 text-xs">
            <h3 className="font-heading font-bold text-primary flex items-center gap-1.5">
              <span className="material-symbols-outlined text-tertiary text-[18px]">check_circle</span>
              <span>What We Check:</span>
            </h3>
            <ul className="space-y-1.5 text-on-surface-variant list-disc list-inside">
              <li>Landlord phone number OTP verification</li>
              <li>National Registration Bureau (NRB) photo ID card match</li>
              <li>Walking distance from designated campus gates</li>
              <li>Physical presence of borehole pump and perimeter walls</li>
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/30 flex flex-col gap-2 text-xs">
            <h3 className="font-heading font-bold text-error flex items-center gap-1.5">
              <span className="material-symbols-outlined text-error text-[18px]">cancel</span>
              <span>We Never Claim "100% Safe":</span>
            </h3>
            <ul className="space-y-1.5 text-on-surface-variant list-disc list-inside">
              <li>We cannot guarantee future roommate behavior</li>
              <li>We do not control municipal water or ESCOM national cuts</li>
              <li>Students must physically inspect every room before paying</li>
              <li>Tenancy disputes are mediated via campus welfare guidelines</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Emergency CTA */}
      <div className="p-6 rounded-2xl bg-secondary-fixed text-on-secondary-fixed flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-heading font-bold text-base sm:text-lg">
            Encountered a Suspicious Landlord?
          </h3>
          <p className="text-xs sm:text-sm text-on-secondary-fixed-variant mt-1">
            Report any request for advance payments immediately to our 24/7 student protection desk.
          </p>
        </div>
        <Link to="/contact">
          <Button variant="accent" size="md">
            Contact Safety Desk
          </Button>
        </Link>
      </div>
    </div>
  );
}
