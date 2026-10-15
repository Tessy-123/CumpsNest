import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { registerSchema } from '../utils/validators';
import { useAuth } from '../context/AuthContext';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { GoogleAuthButton } from '../components/ui/GoogleAuthButton';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register: registerUser, loginWithGoogle } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState(null);
  const [googleLoading, setGoogleLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      university: 'unima',
      yearOfStudy: '1st Year',
      password: '',
      confirmPassword: '',
      agreeTerms: true,
    },
  });

  const onSubmit = async (formData) => {
    setFormError(null);
    try {
      await registerUser(formData);
      navigate('/dashboard');
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to complete registration. Please try again.');
    }
  };

  const handleGoogleSignUp = async () => {
    setFormError(null);
    setGoogleLoading(true);
    try {
      await loginWithGoogle();
      navigate('/dashboard');
    } catch (err) {
      setFormError(
        err.response?.data?.message || 'Google sign-up could not be completed. Please try again or register with your email.'
      );
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-center py-10 px-4 sm:px-6 max-w-lg mx-auto w-full">
      <div className="flex flex-col mb-6">
        <div className="inline-flex items-center gap-1.5 bg-surface-container px-3 py-1 rounded-full w-fit mb-3 shadow-sm">
          <span className="material-symbols-outlined text-[16px] text-tertiary-container" style={{ fontVariationSettings: "'FILL' 1" }}>
            school
          </span>
          <span className="font-heading text-xs font-semibold text-on-surface-variant">
            Verified Student Registration
          </span>
        </div>

        <h1 className="font-heading text-2xl sm:text-3xl text-primary font-extrabold tracking-tight">
          Create Student Account
        </h1>
        <p className="font-sans text-xs sm:text-sm text-on-surface-variant mt-1 leading-relaxed">
          Join thousands of university scholars finding safe, verified hostels in Malawi.
        </p>
      </div>

      {formError && (
        <div className="rounded-xl bg-error-container p-4 text-xs text-on-error-container mb-6 border border-error/20 flex items-start gap-2.5">
          <span className="material-symbols-outlined text-[18px] text-error shrink-0">error</span>
          <span>{formError}</span>
        </div>
      )}

      {/* Google Quick Sign-Up */}
      <div className="flex flex-col gap-4 mb-5">
        <GoogleAuthButton
          text="Sign up with Google"
          loading={googleLoading}
          onClick={handleGoogleSignUp}
        />

        <div className="relative flex items-center justify-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-outline-variant/40" />
          </div>
          <span className="relative bg-surface px-3 text-[11px] uppercase tracking-wider font-semibold text-on-surface-variant">
            Or register with student details
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        {/* Full Name */}
        <Input
          label="Full Legal Name"
          placeholder="e.g. Chisomo Banda"
          icon="person"
          required
          {...register('fullName')}
          error={errors.fullName?.message}
        />

        {/* Email */}
        <Input
          label="College or Personal Email"
          type="email"
          placeholder="e.g. chisomo.banda@unima.ac.mw"
          icon="mail"
          required
          hint="University domain emails receive instant verified status"
          {...register('email')}
          error={errors.email?.message}
        />

        {/* Malawian Phone */}
        <Input
          label="Malawian Mobile Number"
          type="tel"
          placeholder="0888 123 456 or 0999 123 456"
          icon="phone_iphone"
          required
          hint="Used for viewing notifications and direct landlord contact"
          {...register('phone')}
          error={errors.phone?.message}
        />

        {/* University and Year of Study */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="uni-select" className="font-heading text-xs font-bold text-on-surface">
              University Affiliation <span className="text-error">*</span>
            </label>
            <div className="relative">
              <select
                id="uni-select"
                className="w-full h-12 pl-3 pr-8 rounded-lg bg-surface-container-low text-xs sm:text-sm text-on-surface border border-outline-variant/40 appearance-none focus:outline-none focus:ring-2 focus:ring-primary"
                {...register('university')}
              >
                <option value="unima">UNIMA (Chancellor College)</option>
                <option value="must">MUST (Thyolo)</option>
                <option value="kuhes">KUHeS (Blantyre)</option>
                <option value="mubas">MUBAS (Blantyre)</option>
                <option value="luanar">LUANAR (Bunda / NRC)</option>
                <option value="mzuni">MZUNI (Mzuzu)</option>
                <option value="dmi">DMI (DMI Mangochi Campus)</option>
              </select>
              <span className="material-symbols-outlined absolute right-2.5 top-3.5 text-on-surface-variant text-[18px] pointer-events-none">
                expand_more
              </span>
            </div>
            {errors.university && (
              <span className="text-xs text-error">{errors.university.message}</span>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="year-select" className="font-heading text-xs font-bold text-on-surface">
              Current Year of Study
            </label>
            <div className="relative">
              <select
                id="year-select"
                className="w-full h-12 pl-3 pr-8 rounded-lg bg-surface-container-low text-xs sm:text-sm text-on-surface border border-outline-variant/40 appearance-none focus:outline-none focus:ring-2 focus:ring-primary"
                {...register('yearOfStudy')}
              >
                <option value="1st Year">1st Year Undergraduate</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year Finalist</option>
                <option value="Postgraduate">Postgraduate / Masters</option>
              </select>
              <span className="material-symbols-outlined absolute right-2.5 top-3.5 text-on-surface-variant text-[18px] pointer-events-none">
                expand_more
              </span>
            </div>
          </div>
        </div>

        {/* Password */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="reg-pass" className="font-heading text-xs font-bold text-on-surface">
            Password (at least 8 characters with letters & numbers) <span className="text-error">*</span>
          </label>
          <div className="relative flex items-center">
            <span className="material-symbols-outlined absolute left-3 text-on-surface-variant text-[18px]">
              lock
            </span>
            <input
              id="reg-pass"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              className="w-full h-12 pl-10 pr-12 rounded-lg bg-surface-container-low text-xs sm:text-sm text-on-surface border border-outline-variant/40 focus:outline-none focus:ring-2 focus:ring-primary"
              {...register('password')}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label="Toggle password visibility"
              className="absolute right-2 text-on-surface-variant p-2"
            >
              <span className="material-symbols-outlined text-[18px]">
                {showPassword ? 'visibility_off' : 'visibility'}
              </span>
            </button>
          </div>
          {errors.password && (
            <span className="text-xs text-error">{errors.password.message}</span>
          )}
        </div>

        {/* Confirm Password */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="reg-confirm" className="font-heading text-xs font-bold text-on-surface">
            Confirm Password <span className="text-error">*</span>
          </label>
          <input
            id="reg-confirm"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            className="w-full h-12 px-3.5 rounded-lg bg-surface-container-low text-xs sm:text-sm text-on-surface border border-outline-variant/40 focus:outline-none focus:ring-2 focus:ring-primary"
            {...register('confirmPassword')}
          />
          {errors.confirmPassword && (
            <span className="text-xs text-error">{errors.confirmPassword.message}</span>
          )}
        </div>

        {/* Safety Agreement */}
        <label className="flex items-start gap-2.5 cursor-pointer text-xs text-on-surface-variant py-1">
          <input
            type="checkbox"
            className="w-4 h-4 rounded accent-primary mt-0.5 cursor-pointer"
            {...register('agreeTerms')}
          />
          <span>
            I acknowledge CampusNest's Zero Advance Fee policy and agree to the{' '}
            <Link to="/terms" className="text-primary font-bold hover:underline">Terms of Service</Link>{' '}
            and{' '}
            <Link to="/safety" className="text-primary font-bold hover:underline">Safety Guidelines</Link>.
          </span>
        </label>
        {errors.agreeTerms && (
          <span className="text-xs text-error">{errors.agreeTerms.message}</span>
        )}

        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          loading={isSubmitting}
          icon="how_to_reg"
        >
          Create Free Student Account
        </Button>
      </form>

      <div className="mt-6 text-center text-xs text-on-surface-variant">
        Already registered?{' '}
        <Link to="/login" className="font-heading font-bold text-primary hover:underline">
          Sign In here
        </Link>
      </div>
    </div>
  );
}
