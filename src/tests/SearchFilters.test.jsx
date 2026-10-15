import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, it, expect, beforeEach } from 'vitest';
import ExplorePage from '../pages/ExplorePage';
import App from '../App';
import { AuthProvider } from '../context/AuthContext';
import { accommodationsService } from '../services/accommodations.service';

function renderExplorePage() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <ExplorePage />
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

describe('Search Filters and Exploration Component', () => {
  beforeEach(() => {
    localStorage.clear();
    window.history.pushState({}, '', '/');
  });

  it('renders search filter controls and budget slider', async () => {
    renderExplorePage();

    expect(screen.getByText(/Refine Search/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Monthly budget in Malawi Kwacha/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Reset Filters/i })).toBeInTheDocument();
  });

  it('renders university selection chips for UNIMA, MUST, KUHeS, LUANAR, and MZUNI', () => {
    renderExplorePage();

    expect(screen.getByText(/UNIMA \(University of Malawi\)/i)).toBeInTheDocument();
    expect(screen.getByText(/MUST \(Malawi University of Science and Tech\)/i)).toBeInTheDocument();
    expect(screen.getByText(/KUHeS \(Kamuzu University of Health Sciences\)/i)).toBeInTheDocument();
    expect(screen.getByText(/LUANAR \(Lilongwe University of Agriculture & Natural Resources\)/i)).toBeInTheDocument();
    expect(screen.getByText(/MZUNI \(Mzuzu University\)/i)).toBeInTheDocument();
    expect(screen.getByText(/DMI \(DMI St. John the Baptist University\)/i)).toBeInTheDocument();
  });

  it('filters accommodations service correctly by university and budget in mock mode', async () => {
    // Direct service unit test for filter logic
    const allResults = await accommodationsService.getAccommodations();
    expect(allResults.data.length).toBeGreaterThan(0);

    const unimaResults = await accommodationsService.getAccommodations({ university: 'unima' });
    expect(unimaResults.data.every((item) => item.universityId === 'unima')).toBe(true);

    const dmiResults = await accommodationsService.getAccommodations({ university: 'dmi' });
    expect(dmiResults.data.length).toBeGreaterThan(0);
    expect(dmiResults.data.every((item) => item.universityId === 'dmi')).toBe(true);

    const budgetResults = await accommodationsService.getAccommodations({ maxPrice: '50000' });
    expect(budgetResults.data.every((item) => item.price <= 50000)).toBe(true);

    const singleRoomResults = await accommodationsService.getAccommodations({ type: 'single' });
    expect(singleRoomResults.data.every((item) => item.roomType === 'single')).toBe(true);
  });

  it('clears all filters when clicking Reset Filters', async () => {
    renderExplorePage();

    const resetBtn = screen.getByRole('button', { name: /Reset Filters/i });
    fireEvent.click(resetBtn);

    await waitFor(() => {
      expect(screen.getByLabelText(/Monthly budget in Malawi Kwacha/i)).toHaveValue('120000');
    });
  });
});

describe('Application routing', () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem('campusnest_token', 'mock-token');
    localStorage.setItem('campusnest_user', JSON.stringify({ id: 'user-1', fullName: 'Test User' }));
    window.history.pushState({}, '', '/landlord/listings/new');
  });

  it('renders the landlord listing creation route', async () => {
    render(<App />);

    expect(await screen.findByRole('heading', { name: /Create New Accommodation Listing/i })).toBeInTheDocument();
  });
});
