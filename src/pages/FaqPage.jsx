import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function FaqPage() {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      q: 'Do I have to pay to view a room?',
      a: 'No! All walkthroughs scheduled on CampusNest are 100% free of charge. If any landlord or agent asks you to send Airtel Money or Mpamba before viewing the premises, do not pay and report them immediately using the report listing tool.',
    },
    {
      q: 'Why is the exact gate address hidden on the listing?',
      a: 'To safeguard student and host privacy and prevent unauthorized overcrowding at private compounds, CampusNest discloses the general neighborhood and walking distance to campus. The exact gate number and meeting point are shared once your free walkthrough is confirmed.',
    },
    {
      q: 'How are hostel prices formatted in Malawi Kwacha?',
      a: 'All rental prices and refundable deposits are stated clearly in Malawi Kwacha (MWK). Listings clearly specify whether utilities (water, trash, solar power) are included in the base rate or if ESCOM is sub-metered.',
    },
    {
      q: 'Which Malawian universities does CampusNest serve?',
      a: 'CampusNest covers all major public and private university corridors in Malawi: University of Malawi (UNIMA / Chancellor College) in Zomba, MUST in Thyolo, KUHeS and MUBAS in Blantyre, LUANAR (Bunda / NRC) in Lilongwe, and MZUNI in Mzuzu.',
    },
    {
      q: 'What should I check during an in-person room inspection?',
      a: 'Inspect the borehole water pressure, test the window burglar bars and door deadbolts, check if backup solar lights work during load shedding, and verify the quiet hours policy with the caretaker.',
    },
    {
      q: 'How does CampusNest verify landlords?',
      a: 'CampusNest cross-checks landlord phone SIMs via one-time SMS verification, audits National Registration Bureau (NRB) identity cards, and sends campus student ambassadors to physically verify compound locations.',
    },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 flex flex-col gap-8 pb-24">
      <div className="flex flex-col gap-2">
        <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-primary tracking-tight">
          Frequently Asked Questions
        </h1>
        <p className="font-sans text-sm text-on-surface-variant">
          Everything Malawian students need to know about finding verified campus accommodation.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="rounded-2xl bg-surface-container-lowest border border-outline-variant/40 overflow-hidden shadow-sm transition-all"
            >
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-heading font-bold text-sm sm:text-base text-on-surface hover:text-primary transition-colors"
              >
                <span>{faq.q}</span>
                <span className="material-symbols-outlined text-[20px] text-primary shrink-0">
                  {isOpen ? 'expand_less' : 'expand_more'}
                </span>
              </button>

              {isOpen && (
                <div className="px-4 sm:px-5 pb-5 pt-1 text-xs sm:text-sm text-on-surface-variant leading-relaxed border-t border-outline-variant/20">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="p-5 rounded-xl bg-surface-container-low border border-outline-variant/40 flex items-center justify-between text-xs text-on-surface-variant">
        <span>Still have questions?</span>
        <Link to="/contact" className="font-heading font-bold text-primary hover:underline">
          Contact our Ambassador Desk
        </Link>
      </div>
    </div>
  );
}
