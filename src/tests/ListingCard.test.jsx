import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import { ListingCard } from '../components/listings/ListingCard';
import { AuthProvider } from '../context/AuthContext';

const mockListing = {
  id: 'test-001',
  title: 'Sunrise Heights Executive Student Pod',
  universityName: 'UNIMA (University of Malawi)',
  area: 'Chikanda Village, Zomba',
  distanceToGate: '~650m from UNIMA Main Gate (7 min walk)',
  price: 65000,
  roomTypeName: 'Self-Contained Single Room',
  availabilityStatus: 'Immediate Vacancy • 1 Room Left',
  images: ['https://images.unsplash.com/photo-1555854877-bab0e564b8d5'],
};

function renderWithProviders(ui) {
  return render(
    <AuthProvider>
      <BrowserRouter>{ui}</BrowserRouter>
    </AuthProvider>
  );
}

describe('ListingCard Component', () => {
  it('renders property title, area, and distance correctly', () => {
    renderWithProviders(<ListingCard listing={mockListing} />);

    expect(screen.getByText('Sunrise Heights Executive Student Pod')).toBeInTheDocument();
    expect(screen.getByText('Chikanda Village, Zomba')).toBeInTheDocument();
    expect(screen.getByText(/~650m from UNIMA Main Gate/)).toBeInTheDocument();
  });

  it('renders the price formatted in Malawi Kwacha (MWK)', () => {
    renderWithProviders(<ListingCard listing={mockListing} />);

    const priceEl = screen.getByTestId('listing-price');
    expect(priceEl).toBeInTheDocument();
    expect(priceEl.textContent).toMatch(/MWK\s*65,000/);
  });

  it('renders availability and verification chips', () => {
    renderWithProviders(<ListingCard listing={mockListing} />);

    expect(screen.getByText('Immediate Vacancy • 1 Room Left')).toBeInTheDocument();
    expect(screen.getByText('Verified Physical Spot')).toBeInTheDocument();
  });

  it('handles heart save button toggle interaction', () => {
    const handleToggle = vi.fn();
    renderWithProviders(<ListingCard listing={mockListing} onToggleSave={handleToggle} />);

    const heartBtn = screen.getByTestId('save-button');
    expect(heartBtn).toBeInTheDocument();

    fireEvent.click(heartBtn);
    expect(handleToggle).toHaveBeenCalledTimes(1);
    expect(handleToggle).toHaveBeenCalledWith('test-001');
  });

  it('contains accessible link to listing details', () => {
    renderWithProviders(<ListingCard listing={mockListing} />);

    const detailsLink = screen.getByRole('link', { name: /View Details/i });
    expect(detailsLink).toHaveAttribute('href', '/listings/test-001');
  });
});
