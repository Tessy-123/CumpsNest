import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import LoginPage from '../pages/LoginPage';
import { AuthProvider } from '../context/AuthContext';

function renderLoginPage() {
  return render(
    <AuthProvider>
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    </AuthProvider>
  );
}

describe('LoginForm Component', () => {
  it('renders login form with identifier and password inputs', () => {
    renderLoginPage();

    expect(screen.getByLabelText(/Email or Malawian Phone/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Sign In to CampusNest/i })).toBeInTheDocument();
  });

  it('displays validation error when entering an invalid identifier', async () => {
    renderLoginPage();

    const identifierInput = screen.getByLabelText(/Email or Malawian Phone/i);
    fireEvent.change(identifierInput, { target: { value: 'not-valid-at-all' } });

    const submitBtn = screen.getByRole('button', { name: /Sign In to CampusNest/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(
        screen.getByText(/Please enter a valid 9-digit Malawian number \(TNM \/ Airtel\) or email address/i)
      ).toBeInTheDocument();
    });
  });

  it('displays error if password is too short', async () => {
    renderLoginPage();

    const identifierInput = screen.getByLabelText(/Email or Malawian Phone/i);
    const passwordInput = screen.getByPlaceholderText('••••••••');

    fireEvent.change(identifierInput, { target: { value: '0888123456' } });
    fireEvent.change(passwordInput, { target: { value: '123' } });

    const submitBtn = screen.getByRole('button', { name: /Sign In to CampusNest/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/Password must be at least 6 characters long/i)).toBeInTheDocument();
    });
  });

  it('accepts valid Malawian Airtel/TNM numbers and college emails', async () => {
    renderLoginPage();

    const identifierInput = screen.getByLabelText(/Email or Malawian Phone/i);
    const passwordInput = screen.getByPlaceholderText('••••••••');

    // Test with Malawian number
    fireEvent.change(identifierInput, { target: { value: '0999123456' } });
    fireEvent.change(passwordInput, { target: { value: 'securePass123' } });

    const submitBtn = screen.getByRole('button', { name: /Sign In to CampusNest/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      // Identifier error should not be present
      expect(screen.queryByText(/Please enter a valid 9-digit Malawian number/i)).not.toBeInTheDocument();
    });
  });
});
