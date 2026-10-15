import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState(user?.fullName || 'Chisomo Banda');
  const [phone, setPhone] = useState(user?.phone || '+265 991 600 735');
  const [email] = useState(user?.email || 'chisomo.banda@unima.ac.mw');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const [smsAlerts, setSmsAlerts] = useState(true);
  const [whatsappAlerts, setWhatsappAlerts] = useState(true);

  const handleSave = (e) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="flex flex-col w-full pb-20 max-w-3xl mx-auto px-4 sm:px-6 pt-6 gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-primary tracking-tight">
            Student Profile & Settings
          </h1>
          <p className="font-sans text-xs sm:text-sm text-on-surface-variant mt-0.5">
            Manage your verified student credentials and viewing communication preferences.
          </p>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="text-xs font-heading font-bold text-error hover:bg-error-container/30 px-3 py-2 rounded-lg flex items-center gap-1 active:scale-95 transition-all"
        >
          <span className="material-symbols-outlined text-[18px]">logout</span>
          <span>Log Out</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="p-3.5 rounded-xl bg-[#ECFDF5] border border-[#A7F3D0] text-[#059669] text-xs font-semibold flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px]">check_circle</span>
          <span>Profile changes saved successfully!</span>
        </div>
      )}

      {/* Profile Card */}
      <div className="bg-surface-container-lowest rounded-2xl p-5 sm:p-6 border border-outline-variant/40 shadow-sm flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-primary-container text-on-primary flex items-center justify-center font-heading font-extrabold text-2xl shadow-sm">
            {fullName
              ? fullName
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .substring(0, 2)
              : 'ST'}
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h2 className="font-heading font-bold text-lg text-on-surface">{fullName}</h2>
              <Badge variant="verified" size="sm" icon="verified">
                ID Verified
              </Badge>
            </div>
            <p className="text-xs text-primary font-semibold mt-0.5">
              {user?.university?.toUpperCase() || 'UNIMA'} • Computer Science (Year 2)
            </p>
            <p className="text-[11px] text-on-surface-variant">Zomba Campus, Chirunga Corridor</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="flex flex-col gap-4 pt-4 border-t border-outline-variant/30">
          <Input
            label="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            icon="person"
          />

          <Input
            label="College Email"
            value={email}
            disabled
            icon="mail"
            hint="Email tied to your university student portal identity"
          />

          <Input
            label="Malawian Contact Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            icon="phone_iphone"
            hint="Receives instant SMS alerts when landlord confirms physical viewing"
          />

          {/* Preferences */}
          <div className="flex flex-col gap-3 pt-3 border-t border-outline-variant/20">
            <h3 className="font-heading font-bold text-sm text-on-surface">
              Alert Preferences
            </h3>

            <label className="flex items-center justify-between p-3 rounded-xl bg-surface-container-low cursor-pointer">
              <div className="flex flex-col">
                <span className="font-heading font-semibold text-xs text-on-surface">
                  SMS Notifications
                </span>
                <span className="text-[11px] text-on-surface-variant">
                  Receive SMS reminders for scheduled walkthroughs (recommended for spotty data)
                </span>
              </div>
              <input
                type="checkbox"
                checked={smsAlerts}
                onChange={(e) => setSmsAlerts(e.target.checked)}
                className="w-5 h-5 rounded accent-primary cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-surface-container-low cursor-pointer">
              <div className="flex flex-col">
                <span className="font-heading font-semibold text-xs text-on-surface">
                  WhatsApp Viewing Reminders
                </span>
                <span className="text-[11px] text-on-surface-variant">
                  Allow verified landlords to send gate directions via WhatsApp
                </span>
              </div>
              <input
                type="checkbox"
                checked={whatsappAlerts}
                onChange={(e) => setWhatsappAlerts(e.target.checked)}
                className="w-5 h-5 rounded accent-primary cursor-pointer"
              />
            </label>
          </div>

          <div className="pt-2 flex justify-end">
            <Button type="submit" variant="primary" size="md">
              Save Profile Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
