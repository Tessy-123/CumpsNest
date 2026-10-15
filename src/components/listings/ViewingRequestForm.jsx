import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { viewingRequestSchema } from '../../utils/validators';
import { viewingsService } from '../../services/viewings.service';
import { useAuth } from '../../context/AuthContext';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { formatMWK } from '../../utils/formatMWK';

export default function ViewingRequestForm({
  listing,
  onSuccess,
  onCancel,
}) {
  const { user } = useAuth();
  const [isSuccessView, setIsSuccessView] = useState(false);
  const [createdViewing, setCreatedViewing] = useState(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(viewingRequestSchema),
    defaultValues: {
      preferredDate: 'Tomorrow, Oct 16',
      preferredTimeSlot: '11:30 AM (Post-lecture)',
      contactPhone: user?.phone || '0991600735',
      studentNotes: '',
    },
  });

  const selectedDate = watch('preferredDate');
  const selectedTime = watch('preferredTimeSlot');

  const dateOptions = [
    { label: 'Today', dayNum: '15', dayName: 'Thu', val: 'Today, Oct 15' },
    { label: 'Tomorrow', dayNum: '16', dayName: 'Fri', val: 'Tomorrow, Oct 16' },
    { label: 'Saturday', dayNum: '17', dayName: 'Sat', val: 'Saturday, Oct 17' },
    { label: 'Monday', dayNum: '19', dayName: 'Mon', val: 'Monday, Oct 19' },
  ];

  const timeOptions = [
    { label: '11:30 AM (Post-lecture)', val: '11:30 AM (Post-lecture)' },
    { label: '3:30 PM (Afternoon)', val: '3:30 PM (Afternoon)' },
    { label: '9:00 AM (Morning)', val: '9:00 AM (Morning)' },
    { label: '5:00 PM (Sunset walk)', val: '5:00 PM (Sunset walk)' },
  ];

  const onSubmit = async (formData) => {
    try {
      const result = await viewingsService.requestViewing(listing.id, formData);
      setCreatedViewing(result);
      setIsSuccessView(true);
      if (onSuccess) {
        onSuccess(result);
      }
    } catch (err) {
      console.error('Failed to schedule viewing', err);
    }
  };

  if (isSuccessView) {
    return (
      <div className="flex flex-col items-center text-center gap-4 py-4 animate-in fade-in">
        <div className="w-16 h-16 rounded-full bg-[#ECFDF5] border-2 border-[#A7F3D0] text-[#059669] flex items-center justify-center">
          <span className="material-symbols-outlined text-[36px]" style={{ fontVariationSettings: "'FILL' 1" }}>
            task_alt
          </span>
        </div>

        <div className="flex flex-col gap-1">
          <h3 className="font-heading font-extrabold text-xl text-primary">
            Viewing Request Sent!
          </h3>
          <p className="font-sans text-xs sm:text-sm text-on-surface-variant max-w-sm">
            {listing.landlord?.name || 'The property host'} has received your appointment request for{' '}
            <strong className="text-on-surface">{createdViewing?.preferredDate} at {createdViewing?.preferredTimeSlot}</strong>.
          </p>
        </div>

        {/* Meeting & Safety Card */}
        <div className="w-full bg-surface-container-low p-4 rounded-xl border border-outline-variant/30 text-left flex flex-col gap-2 text-xs">
          <div className="flex items-center gap-2 font-heading font-bold text-primary">
            <span className="material-symbols-outlined text-[18px]">verified</span>
            <span>Next Steps & Gate Directions</span>
          </div>
          <p className="text-on-surface-variant">
            You will receive an SMS reminder on <strong className="text-on-surface">{createdViewing?.contactPhone}</strong> with the exact landmark checkpoint.
          </p>
          <div className="p-2.5 bg-secondary-fixed/50 rounded-lg text-on-secondary-fixed text-[11px] font-semibold mt-1">
            Zero Upfront Fees: Do not send any money before your physical walkthrough.
          </div>
        </div>

        <div className="flex gap-2 w-full mt-2">
          <Button variant="primary" fullWidth onClick={onCancel}>
            Done
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      {/* Listing Summary Thumbnail */}
      <div className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/30 flex items-center gap-3">
        <img
          src={listing.images?.[0] || 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=400&q=80'}
          alt={listing.title}
          className="w-14 h-14 rounded-lg object-cover"
        />
        <div className="flex flex-col min-w-0 flex-1">
          <h4 className="font-heading font-bold text-xs sm:text-sm text-on-surface truncate">
            {listing.title}
          </h4>
          <span className="text-[11px] text-on-surface-variant truncate">{listing.area}</span>
          <span className="text-xs font-heading font-bold text-primary tnum">
            {formatMWK(listing.price)} / month
          </span>
        </div>
      </div>

      {/* Date Radio Grid */}
      <div className="flex flex-col gap-1.5">
        <label className="font-heading font-bold text-xs text-on-surface flex items-center justify-between">
          <span>Select Viewing Day</span>
          <span className="text-on-surface-variant font-normal">October 2025</span>
        </label>
        <div className="grid grid-cols-4 gap-2">
          {dateOptions.map((opt) => {
            const isSelected = selectedDate === opt.val;
            return (
              <button
                key={opt.val}
                type="button"
                onClick={() => setValue('preferredDate', opt.val, { shouldValidate: true })}
                className={`
                  p-2 rounded-xl text-center flex flex-col items-center justify-center transition-all
                  ${
                    isSelected
                      ? 'bg-primary text-on-primary shadow-sm ring-2 ring-primary'
                      : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
                  }
                `}
              >
                <span className="text-[10px] uppercase font-bold opacity-80">{opt.label}</span>
                <span className="font-heading font-extrabold text-base leading-tight mt-0.5">{opt.dayNum}</span>
                <span className="text-[10px] font-semibold">{opt.dayName}</span>
              </button>
            );
          })}
        </div>
        {errors.preferredDate && (
          <span className="text-xs text-error">{errors.preferredDate.message}</span>
        )}
      </div>

      {/* Time Slot Radio Grid */}
      <div className="flex flex-col gap-1.5">
        <label className="font-heading font-bold text-xs text-on-surface">
          Convenient Time Window (Lecture-Free)
        </label>
        <div className="grid grid-cols-2 gap-2">
          {timeOptions.map((opt) => {
            const isSelected = selectedTime === opt.val;
            return (
              <button
                key={opt.val}
                type="button"
                onClick={() => setValue('preferredTimeSlot', opt.val, { shouldValidate: true })}
                className={`
                  py-2.5 px-3 rounded-xl text-xs font-semibold text-center transition-all
                  ${
                    isSelected
                      ? 'bg-primary text-on-primary shadow-sm ring-2 ring-primary'
                      : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
                  }
                `}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
        {errors.preferredTimeSlot && (
          <span className="text-xs text-error">{errors.preferredTimeSlot.message}</span>
        )}
      </div>

      {/* Contact Phone */}
      <Input
        label="Student Contact Phone (for SMS confirmation)"
        placeholder="e.g. 0888 123 456 or 0999 123 456"
        icon="phone_iphone"
        required
        {...register('contactPhone')}
        error={errors.contactPhone?.message}
      />

      {/* Student Notes */}
      <div className="flex flex-col gap-1.5">
        <label className="font-heading font-bold text-xs text-on-surface">
          Notes for Host (Optional)
        </label>
        <textarea
          rows={2}
          placeholder="e.g. First-year UNIMA student, would like to test the study desk space."
          className="w-full p-3 rounded-lg bg-surface-container-low text-xs sm:text-sm font-sans text-on-surface border border-outline-variant/30 focus:outline-none focus:ring-2 focus:ring-primary"
          {...register('studentNotes')}
        />
      </div>

      {/* Trust Reminder */}
      <div className="p-3 bg-secondary-fixed/50 rounded-xl text-xs text-on-secondary-fixed flex items-start gap-2">
        <span className="material-symbols-outlined text-[18px] text-secondary shrink-0">verified_user</span>
        <p className="leading-snug">
          <strong>100% Free Service:</strong> Walkthrough inspections are completely free of charge. Never pay any key or viewing deposit upfront.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 pt-2">
        <Button variant="outline" size="md" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="accent" size="md" fullWidth loading={isSubmitting} icon="check_circle">
          Confirm Walkthrough
        </Button>
      </div>
    </form>
  );
}
