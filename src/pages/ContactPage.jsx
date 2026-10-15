import React, { useState } from 'react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 flex flex-col gap-8 pb-24 text-on-surface">
      <div className="flex flex-col gap-2">
        <h1 className="font-heading font-extrabold text-3xl text-primary tracking-tight">
          Campus Student Support & Trust Desk
        </h1>
        <p className="text-xs sm:text-sm text-on-surface-variant">
          Reach our dedicated student safety ambassadors across Malawian university corridors.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* WhatsApp Support Card */}
        <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/40 shadow-sm flex flex-col gap-2">
          <div className="w-10 h-10 rounded-xl bg-[#25D366]/10 text-[#25D366] flex items-center justify-center">
            <span className="material-symbols-outlined text-[24px]">chat</span>
          </div>
          <h2 className="font-heading font-bold text-base text-on-surface">
            Direct WhatsApp Support
          </h2>
          <p className="text-xs text-on-surface-variant">
            Fastest assistance for urgent viewing verifications or reporting suspicious landlords.
          </p>
          <a
            href="https://wa.me/265991600735"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 text-xs font-heading font-bold text-[#25D366] hover:underline flex items-center gap-1"
          >
            <span>+265 991 600 735</span>
            <span className="material-symbols-outlined text-[16px]">open_in_new</span>
          </a>
        </div>

        {/* Emergency Fraud Hotline */}
        <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/40 shadow-sm flex flex-col gap-2">
          <div className="w-10 h-10 rounded-xl bg-error-container text-error flex items-center justify-center">
            <span className="material-symbols-outlined text-[24px]">call</span>
          </div>
          <h2 className="font-heading font-bold text-base text-on-surface">
            Safety & Scam Hotline
          </h2>
          <p className="text-xs text-on-surface-variant">
            Call immediately if an advance booking deposit was requested by an unverified person.
          </p>
          <a
            href="tel:+265991600735"
            className="mt-2 text-xs font-heading font-bold text-error hover:underline flex items-center gap-1"
          >
            <span>+265 991 600 735 (Emergency Hotline)</span>
          </a>
        </div>
      </div>

      {/* Inquiry Form */}
      <div className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant/40 shadow-sm flex flex-col gap-4">
        <h2 className="font-heading font-bold text-base text-on-surface">
          Send a General Inquiry
        </h2>

        {submitted ? (
          <div className="p-4 rounded-xl bg-[#ECFDF5] border border-[#A7F3D0] text-[#059669] text-xs font-semibold">
            Thank you! Your message has been received. Our campus ambassador will reply within 4 hours.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <Input label="Your Name" placeholder="Chisomo Banda" required />
            <Input label="Your Phone or Email" placeholder="088... or chisomo@unima.ac.mw" required />
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-heading font-bold text-on-surface">
                Message / Campus Inquiry
              </label>
              <textarea
                rows={3}
                required
                placeholder="How can we assist you with university hostels?"
                className="w-full p-3 rounded-lg bg-surface-container-lowest border border-outline-variant/40 text-xs sm:text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <Button type="submit" variant="primary" size="md">
              Send Message
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
