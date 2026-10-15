import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { reportListingSchema } from '../utils/validators';
import { accommodationsService } from '../services/accommodations.service';
import { reportsService } from '../services/reports.service';
import { formatMWK } from '../utils/formatMWK';
import { Button } from '../components/ui/Button';

export default function ReportListingPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [submittedCase, setSubmittedCase] = useState(null);

  // Fetch listing details to show flagged unit thumbnail
  const { data: listing } = useQuery({
    queryKey: ['accommodation', id],
    queryFn: () => accommodationsService.getAccommodationById(id),
    enabled: Boolean(id),
  });

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(reportListingSchema),
    defaultValues: {
      reason: 'scam',
      details: '',
      contactConsent: true,
    },
  });

  const selectedReason = watch('reason');

  const onSubmit = async (formData) => {
    try {
      const result = await reportsService.submitReport(id || 'unknown', formData);
      setSubmittedCase(result);
    } catch (err) {
      console.error('Failed to submit report', err);
    }
  };

  const reasonOptions = [
    {
      id: 'scam',
      title: 'Suspected Scam',
      badge: 'High Priority',
      desc: 'Demanded advance booking fee via Airtel Money/Mpamba, unreachable phone, or fake caretaker identity.',
    },
    {
      id: 'advance_fee',
      title: 'Requested Money Before Viewing',
      badge: 'Zero Tolerance',
      desc: 'Landlord refused to show room unless a booking or registration deposit was transferred first.',
    },
    {
      id: 'inaccurate_info',
      title: 'Inaccurate Photos or Amenities',
      badge: 'Audit Review',
      desc: 'Photos do not match the physical room, or promised amenities (solar backup, borehole) do not exist.',
    },
    {
      id: 'unavailable',
      title: 'Room Already Taken / Fully Booked',
      badge: 'Registry Update',
      desc: 'The landlord indicated the room was already filled but the listing remains marked as available.',
    },
    {
      id: 'safety_concern',
      title: 'Safety or Structural Concern',
      badge: 'Safety Desk',
      desc: 'Missing window burglar bars, unsafe electrical wiring, or hazardous compound boundary.',
    },
  ];

  return (
    <div className="flex flex-col w-full pb-20 max-w-2xl mx-auto px-4 sm:px-6 pt-6 gap-5">
      {/* Safety Trust Anchor Badge */}
      <div className="flex items-center justify-between bg-surface-container-low px-4 py-2.5 rounded-xl border border-outline-variant/30">
        <div className="flex items-center gap-2 text-primary">
          <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
            verified_user
          </span>
          <span className="font-heading text-xs font-bold uppercase tracking-wider text-primary">
            Campus Safety & Trust Desk
          </span>
        </div>
        <div className="flex items-center gap-1.5 bg-surface-container-highest text-primary px-2.5 py-0.5 rounded-full text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
          <span>Confidential Report</span>
        </div>
      </div>

      {/* Screen Title & Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-on-surface tracking-tight">
            Report Listing
          </h1>
          <p className="font-sans text-xs sm:text-sm text-on-surface-variant mt-0.5">
            Help protect Malawian students from rental fraud and false listings.
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate(-1)}
          aria-label="Close report screen"
          className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-on-surface active:scale-95 transition-transform"
        >
          <span className="material-symbols-outlined text-[22px]">close</span>
        </button>
      </div>

      {/* Flagged Listing Target Summary Card */}
      {listing && (
        <div className="bg-surface-container-lowest rounded-xl p-3.5 border border-outline-variant/40 shadow-sm flex gap-3 items-center">
          <img
            src={listing.images?.[0] || 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=300&q=80'}
            alt={listing.title}
            className="w-16 h-16 rounded-lg object-cover"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1 text-secondary text-xs font-bold">
              <span className="material-symbols-outlined text-[15px]">report_problem</span>
              <span className="uppercase tracking-wide">Flagged Property</span>
            </div>
            <h2 className="font-heading font-bold text-sm text-on-surface truncate">
              {listing.title}
            </h2>
            <p className="text-xs text-on-surface-variant truncate">{listing.area}</p>
            <div className="flex items-center justify-between mt-0.5">
              <span className="font-heading font-bold text-xs text-primary tnum">
                {formatMWK(listing.price)}/mo
              </span>
              <span className="text-[11px] text-on-surface-variant">Host: {listing.landlord?.name}</span>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRMATION SCREEN (STEP 2) */}
      {submittedCase ? (
        <div className="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant/40 shadow-sm flex flex-col items-center text-center gap-4 animate-in fade-in">
          <div className="w-16 h-16 rounded-full bg-[#ECFDF5] border-2 border-[#A7F3D0] text-[#059669] flex items-center justify-center">
            <span className="material-symbols-outlined text-[36px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              security
            </span>
          </div>

          <div className="flex flex-col gap-1">
            <h2 className="font-heading font-extrabold text-xl sm:text-2xl text-primary">
              Report Successfully Logged
            </h2>
            <p className="font-sans text-xs sm:text-sm text-on-surface-variant max-w-md">
              Thank you for keeping Malawian university students safe. Our Student Safety Ambassador team has opened an investigation into this property.
            </p>
          </div>

          <div className="w-full bg-surface-container p-4 rounded-xl border border-outline-variant/30 flex flex-col gap-2 text-left text-xs">
            <div className="flex items-center justify-between">
              <span className="text-on-surface-variant">Case Reference Number:</span>
              <strong className="font-heading font-bold text-primary text-sm">{submittedCase.caseReference}</strong>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-on-surface-variant">Status:</span>
              <span className="font-semibold text-secondary uppercase tracking-wider text-[11px]">Under Review (24h)</span>
            </div>
            <p className="text-[11px] text-on-surface-variant pt-2 border-t border-outline-variant/20">
              If this landlord demands money from other students via Airtel Money or Mpamba, their account will be deactivated and blacklisted across campus gates.
            </p>
          </div>

          <div className="flex gap-2 w-full pt-2">
            <Button variant="primary" fullWidth onClick={() => navigate('/explore')}>
              Return to Listings
            </Button>
          </div>
        </div>
      ) : (
        /* REPORT FORM (STEP 1) */
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          {/* Strict Zero Advance Fee Policy Box */}
          <div className="bg-secondary-fixed text-on-secondary-fixed rounded-xl p-4 flex gap-3 items-start border border-secondary-fixed-dim">
            <span className="material-symbols-outlined text-secondary text-[22px] shrink-0 mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>
              security
            </span>
            <div>
              <p className="font-heading font-bold text-xs sm:text-sm text-on-secondary-fixed">
                Strict Zero Advance Fee Policy
              </p>
              <p className="font-sans text-xs text-on-secondary-fixed-variant mt-0.5 leading-relaxed">
                Never send Airtel Money or Mpamba payments before inspecting a property in person. Your report remains 100% confidential.
              </p>
            </div>
          </div>

          {/* Reason for Reporting Cards */}
          <div className="flex flex-col gap-2">
            <label className="font-heading font-bold text-xs sm:text-sm text-on-surface">
              Reason for Reporting <span className="text-error">*</span>
            </label>

            <div className="flex flex-col gap-2">
              {reasonOptions.map((opt) => {
                const isSelected = selectedReason === opt.id;
                return (
                  <label
                    key={opt.id}
                    className={`
                      p-3.5 rounded-xl border cursor-pointer transition-all flex items-start gap-3
                      ${
                        isSelected
                          ? 'bg-surface-container-high border-primary ring-1 ring-primary shadow-sm'
                          : 'bg-surface-container-lowest border-outline-variant/40 hover:bg-surface-container-low'
                      }
                    `}
                  >
                    <input
                      type="radio"
                      value={opt.id}
                      className="mt-1 accent-primary w-4 h-4 cursor-pointer shrink-0"
                      {...register('reason')}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-heading font-bold text-xs sm:text-sm text-on-surface">
                          {opt.title}
                        </span>
                        <span className="bg-surface-container text-on-surface-variant font-heading text-[10px] px-2 py-0.5 rounded-full font-semibold">
                          {opt.badge}
                        </span>
                      </div>
                      <p className="font-sans text-xs text-on-surface-variant mt-0.5 leading-snug">
                        {opt.desc}
                      </p>
                    </div>
                  </label>
                );
              })}
            </div>
            {errors.reason && (
              <span className="text-xs text-error font-medium">{errors.reason.message}</span>
            )}
          </div>

          {/* Incident Details Textarea */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="details-field" className="font-heading font-bold text-xs sm:text-sm text-on-surface">
              Describe What Happened <span className="text-error">*</span>
            </label>
            <textarea
              id="details-field"
              rows={4}
              placeholder="Provide exact details (e.g. Host asked for MWK 10,000 viewing fee via Airtel Money to phone number 099xxxxxxx; or water pump has been disconnected)."
              className={`
                w-full p-3.5 rounded-xl font-sans text-xs sm:text-sm bg-surface-container-low border text-on-surface focus:outline-none focus:ring-2 focus:ring-primary
                ${errors.details ? 'border-error bg-error-container/20' : 'border-outline-variant/40'}
              `}
              {...register('details')}
            />
            {errors.details && (
              <span className="text-xs text-error font-medium">{errors.details.message}</span>
            )}
          </div>

          {/* Consent Checkbox */}
          <label className="flex items-center gap-2 cursor-pointer text-xs text-on-surface-variant py-1">
            <input
              type="checkbox"
              className="w-4 h-4 rounded accent-primary cursor-pointer"
              {...register('contactConsent')}
            />
            <span>
              CampusNest may contact me confidentially if clarification is needed for the campus safety log.
            </span>
          </label>

          {/* Submit Action */}
          <Button
            type="submit"
            variant="danger"
            size="lg"
            fullWidth
            loading={isSubmitting}
            icon="flag"
          >
            Submit Confidential Report
          </Button>
        </form>
      )}
    </div>
  );
}
