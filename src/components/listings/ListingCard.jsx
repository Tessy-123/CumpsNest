import React from 'react';
import { Link } from 'react-router-dom';
import { formatMWK } from '../../utils/formatMWK';
import { useAuth } from '../../context/AuthContext';

export function ListingCard({ listing, onToggleSave }) {
  const { isListingSaved, toggleSaveListing } = useAuth();
  const saved = isListingSaved(listing.id);

  const handleHeartClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onToggleSave) {
      onToggleSave(listing.id);
    } else {
      toggleSaveListing(listing.id);
    }
  };

  const primaryImage =
    listing.images?.[0] ||
    'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80';

  return (
    <article
      data-testid="listing-card"
      className="group bg-surface-container-lowest rounded-xl border border-outline-variant/50 overflow-hidden hover:border-[#CCECE8] hover:shadow-[0_4px_12px_-2px_rgba(13,92,88,0.08)] transition-all flex flex-col"
    >
      {/* Photo Container */}
      <div className="relative w-full aspect-[16/10] bg-surface-container overflow-hidden">
        <img
          src={primaryImage}
          alt={listing.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-on-surface/60 via-transparent to-black/10 pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start">
          <span className="bg-primary text-on-primary font-heading font-semibold text-[11px] px-2.5 py-0.5 rounded-full shadow-sm flex items-center gap-1">
            <span className="material-symbols-outlined text-[13px]">school</span>
            <span>{listing.universityName ? listing.universityName.split(' ')[0] : 'Campus'}</span>
          </span>

          {listing.availabilityStatus && (
            <span className="bg-secondary text-on-secondary font-heading font-bold text-[10px] px-2 py-0.5 rounded-full shadow-sm flex items-center gap-1">
              <span className="material-symbols-outlined text-[12px]">bolt</span>
              <span>{listing.availabilityStatus}</span>
            </span>
          )}
        </div>

        {/* Save to Favorites Heart Button */}
        <button
          type="button"
          aria-label={saved ? `Remove ${listing.title} from saved` : `Save ${listing.title} to favorites`}
          data-testid="save-button"
          onClick={handleHeartClick}
          className="absolute top-2.5 right-2.5 w-9 h-9 rounded-full bg-surface/90 backdrop-blur-md flex items-center justify-center text-secondary hover:scale-110 active:scale-95 transition-all shadow-sm"
        >
          <span
            className={`material-symbols-outlined text-[20px] ${saved ? 'text-secondary' : 'text-on-surface-variant'}`}
            style={{ fontVariationSettings: saved ? "'FILL' 1" : "'FILL' 0" }}
          >
            {saved ? 'favorite' : 'favorite_border'}
          </span>
        </button>

        {/* Verification Pill on photo */}
        <div className="absolute bottom-2.5 left-2.5">
          <span className="bg-surface/90 backdrop-blur-md text-primary font-heading font-semibold text-[10px] px-2 py-0.5 rounded-full shadow-sm flex items-center gap-1">
            <span className="material-symbols-outlined text-[13px] text-tertiary" style={{ fontVariationSettings: "'FILL' 1" }}>
              verified
            </span>
            <span>Verified Physical Spot</span>
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between gap-2.5">
        <div>
          {/* General Area & Distance to Gate */}
          <div className="flex items-center gap-1 text-primary text-xs font-semibold">
            <span className="material-symbols-outlined text-[15px] text-secondary">distance</span>
            <span className="truncate">{listing.area}</span>
          </div>

          {/* Title */}
          <h3 className="font-heading font-bold text-base text-on-surface group-hover:text-primary transition-colors line-clamp-1 mt-1">
            <Link to={`/listings/${listing.id}`}>
              {listing.title}
            </Link>
          </h3>

          {/* Distance Subtitle */}
          <p className="text-xs text-on-surface-variant flex items-center gap-1 mt-0.5 tnum">
            <span className="material-symbols-outlined text-[14px] text-primary">directions_walk</span>
            <span className="truncate">{listing.distanceToGate}</span>
          </p>

          {/* Key Amenities Snippets */}
          <div className="flex flex-wrap gap-1.5 mt-2.5">
            <span className="inline-flex items-center gap-1 bg-surface-container text-on-surface-variant text-[11px] font-medium px-2 py-0.5 rounded">
              <span className="material-symbols-outlined text-[13px] text-primary">meeting_room</span>
              <span>{listing.roomTypeName || 'Single Room'}</span>
            </span>
            <span className="inline-flex items-center gap-1 bg-surface-container text-on-surface-variant text-[11px] font-medium px-2 py-0.5 rounded">
              <span className="material-symbols-outlined text-[13px] text-tertiary">water_drop</span>
              <span>Borehole Water</span>
            </span>
            <span className="inline-flex items-center gap-1 bg-surface-container text-on-surface-variant text-[11px] font-medium px-2 py-0.5 rounded">
              <span className="material-symbols-outlined text-[13px] text-primary">solar_power</span>
              <span>Solar Backup</span>
            </span>
          </div>
        </div>

        {/* Pricing and Action CTA */}
        <div className="pt-2.5 border-t border-outline-variant/30 flex items-center justify-between gap-2 mt-auto">
          <div className="flex flex-col">
            <span className="font-heading font-bold text-base sm:text-lg text-primary tnum leading-tight" data-testid="listing-price">
              {formatMWK(listing.price)}
            </span>
            <span className="text-[11px] text-on-surface-variant">/ month</span>
          </div>

          <Link
            to={`/listings/${listing.id}`}
            className="h-10 px-3.5 rounded-lg bg-primary hover:bg-primary-container text-on-primary text-xs font-heading font-bold flex items-center justify-center gap-1 shadow-sm active:scale-98 transition-all shrink-0"
          >
            <span>View Details</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </Link>
        </div>
      </div>
    </article>
  );
}
