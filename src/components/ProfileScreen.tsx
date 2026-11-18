import { useState } from 'react';
import {
  ArrowLeft,
  Bell,
  Globe,
  Languages,
  Trash2,
  Crown,
  CheckCircle2,
  Star,
  Share2,
  Shield,
  X,
} from 'lucide-react';
import {
  type CountryCode,
  type RecentScan,
  formatPrice,
  getCountryMeta,
  getPrice,
} from '../data/pricing';

interface ProfileScreenProps {
  country: CountryCode;
  scans: RecentScan[];
  notificationsEnabled: boolean;
  isPremium: boolean;
  onToggleNotifications: () => void;
  onUpgradePremium: () => void;
  onClearHistory: () => void;
  onChangeCountry: () => void;
  onBackHome: () => void;
}

export function ProfileScreen({
  country,
  scans,
  notificationsEnabled,
  isPremium,
  onToggleNotifications,
  onUpgradePremium,
  onClearHistory,
  onChangeCountry,
  onBackHome,
}: ProfileScreenProps) {
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  const countryMeta = getCountryMeta(country);
  const totalScansCount = 12 + Math.max(0, scans.length - 3);
  const totalSavedAmount = getPrice('Medium Dent', country) * 2;
  const formattedTotalSaved = formatPrice(totalSavedAmount, country);

  const showTempMessage = (msg: string) => {
    setFeedbackMessage(msg);
    window.setTimeout(() => setFeedbackMessage(null), 3000);
  };

  const handleClearHistory = () => {
    onClearHistory();
    showTempMessage('Scan history cleared from local storage.');
  };

  const handleRateApp = () => {
    showTempMessage('Thanks for rating Car Dent AI 5 stars!');
  };

  const handleShareApp = async () => {
    const shareText = 'Check out Car Dent AI — Snap. Detect. Fix.';
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Car Dent AI',
          text: shareText,
          url: window.location.href,
        });
        showTempMessage('Shared Car Dent AI.');
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(`${shareText} ${window.location.href}`);
        showTempMessage('App link copied to clipboard.');
      } else {
        showTempMessage('Ready to share Car Dent AI.');
      }
    } catch {
      showTempMessage('Share action closed.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Row */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onBackHome}
          aria-label="Back to Home"
          className="min-w-[44px] min-h-[44px] rounded-xl bg-[#13131C] border border-white/10 hover:border-white/25 flex items-center justify-center text-zinc-300 hover:text-white transition-colors shrink-0"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-white leading-tight">
            Profile
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400">
            Account, preferences &amp; membership
          </p>
        </div>
      </div>

      {feedbackMessage ? (
        <div
          role="status"
          className="px-4 py-3 rounded-xl bg-[#161622] border border-[#FF6B35]/50 text-xs sm:text-sm text-white flex items-center gap-2"
        >
          <CheckCircle2 className="w-4 h-4 text-[#FF6B35] shrink-0" />
          <span>{feedbackMessage}</span>
        </div>
      ) : null}

      {/* Top User Identity Card */}
      <section className="rounded-3xl bg-[#13131C] border border-white/10 p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4 min-w-0">
          <div className="w-16 h-16 rounded-full bg-[#FF6B35] text-white font-display text-xl font-bold flex items-center justify-center shrink-0 shadow-[0_0_24px_rgba(255,107,53,0.35)]">
            AD
          </div>
          <div className="min-w-0">
            <h2 className="font-display text-xl font-bold text-white truncate">
              Alex Driver
            </h2>
            <p className="text-sm text-zinc-400 truncate">alex@gmail.com</p>
            <p className="text-xs text-zinc-300 mt-1 flex items-center gap-1.5">
              <span aria-hidden="true">{countryMeta.flag}</span>
              <span>Country: {countryMeta.name}</span>
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onChangeCountry}
          className="min-h-[44px] px-4 py-2.5 rounded-xl bg-[#1B1B27] border border-white/15 hover:border-[#FF6B35] text-xs sm:text-sm font-semibold text-white inline-flex items-center justify-center gap-2 transition-colors shrink-0 cursor-pointer"
        >
          <span aria-hidden="true">{countryMeta.flag}</span>
          <span>Change Country</span>
        </button>
      </section>

      {/* Stats Row: 3 Boxes */}
      <section aria-label="Account statistics" className="grid grid-cols-3 gap-3 sm:gap-4">
        <div className="rounded-2xl bg-[#13131C] border border-white/10 p-4">
          <p className="text-xs text-zinc-400">Total Scans</p>
          <p className="font-mono-num text-2xl sm:text-3xl font-bold text-white mt-1.5">
            {totalScansCount}
          </p>
        </div>

        <div className="rounded-2xl bg-[#13131C] border border-white/10 p-4">
          <p className="text-xs text-zinc-400">Total Saved</p>
          <p className="font-mono-num text-2xl sm:text-3xl font-bold text-[#FF6B35] mt-1.5">
            {formattedTotalSaved}
          </p>
        </div>

        <div className="rounded-2xl bg-[#13131C] border border-white/10 p-4">
          <p className="text-xs text-zinc-400">Cars Saved</p>
          <p className="font-mono-num text-2xl sm:text-3xl font-bold text-white mt-1.5">
            {scans.length}
          </p>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Settings List */}
        <section
          aria-labelledby="settings-heading"
          className="lg:col-span-6 rounded-3xl bg-[#13131C] border border-white/10 p-5 sm:p-6"
        >
          <h2
            id="settings-heading"
            className="font-display text-lg font-bold text-white mb-4"
          >
            Settings
          </h2>

          <div className="divide-y divide-white/10">
            {/* Notifications ON/OFF */}
            <div className="py-3.5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Bell className="w-4 h-4 text-[#FF6B35] shrink-0" />
                <div>
                  <p className="text-sm font-medium text-white">Notifications</p>
                  <p className="text-xs text-zinc-400">
                    Estimate alerts &amp; garage updates
                  </p>
                </div>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={notificationsEnabled}
                onClick={onToggleNotifications}
                className={`min-h-[36px] px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                  notificationsEnabled
                    ? 'bg-[#FF6B35] text-white'
                    : 'bg-white/10 text-zinc-300'
                }`}
              >
                {notificationsEnabled ? 'ON' : 'OFF'}
              </button>
            </div>

            {/* Currency Auto */}
            <div className="py-3.5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Globe className="w-4 h-4 text-[#FF6B35] shrink-0" />
                <div>
                  <p className="text-sm font-medium text-white">Currency</p>
                  <p className="text-xs text-zinc-400">
                    Matched to selected country
                  </p>
                </div>
              </div>
              <span className="text-xs font-mono-num font-semibold text-zinc-200">
                Auto ({countryMeta.currencySymbol} {countryMeta.currencyCode})
              </span>
            </div>

            {/* Language: English */}
            <div className="py-3.5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Languages className="w-4 h-4 text-[#FF6B35] shrink-0" />
                <div>
                  <p className="text-sm font-medium text-white">Language</p>
                  <p className="text-xs text-zinc-400">App interface language</p>
                </div>
              </div>
              <span className="text-xs font-semibold text-zinc-200">English</span>
            </div>

            {/* Clear History */}
            <div className="pt-3.5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Trash2 className="w-4 h-4 text-red-400 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-white">Clear History</p>
                  <p className="text-xs text-zinc-400">
                    Remove saved car scan records
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleClearHistory}
                className="min-h-[40px] px-3.5 py-2 rounded-xl bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 text-xs font-semibold text-red-300 transition-colors cursor-pointer"
              >
                Clear History
              </button>
            </div>
          </div>
        </section>

        {/* Premium Card */}
        <section
          aria-labelledby="premium-heading"
          className="lg:col-span-6 rounded-3xl bg-gradient-to-br from-[#1B1518] via-[#13131C] to-[#13131C] border-2 border-[#FF6B35] p-6 shadow-[0_0_32px_rgba(255,107,53,0.16)]"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#FF6B35]">
                <Crown className="w-4 h-4" />
                <span>Car Dent AI Pro</span>
              </div>
              <h2
                id="premium-heading"
                className="font-display text-2xl font-bold text-white mt-1"
              >
                Go Premium
              </h2>
            </div>
            <div className="text-right">
              <span className="font-mono-num text-2xl font-bold text-[#FF6B35]">
                $4.99
              </span>
              <span className="text-xs text-zinc-400 block">/ month</span>
            </div>
          </div>

          <ul className="mt-5 space-y-2.5 text-sm text-zinc-200">
            <li className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#FF6B35] shrink-0" />
              <span>Unlock Unlimited Scans</span>
            </li>
            <li className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#FF6B35] shrink-0" />
              <span>No Ads</span>
            </li>
            <li className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#FF6B35] shrink-0" />
              <span>Detailed Report</span>
            </li>
            <li className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#FF6B35] shrink-0" />
              <span>Priority Garage</span>
            </li>
          </ul>

          {isPremium ? (
            <div className="mt-6 w-full min-h-[52px] px-5 py-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 font-display font-bold text-base flex items-center justify-center gap-2">
              <CheckCircle2 className="w-5 h-5" />
              <span>Premium Unlocked</span>
            </div>
          ) : (
            <button
              type="button"
              onClick={onUpgradePremium}
              className="mt-6 w-full min-h-[52px] px-5 py-3.5 rounded-2xl bg-[#FF6B35] hover:bg-[#ff7d4d] active:scale-[0.99] text-white font-display font-bold text-base flex items-center justify-center gap-2 shadow-[0_8px_24px_rgba(255,107,53,0.35)] transition-all cursor-pointer"
            >
              <Crown className="w-5 h-5" />
              <span>Upgrade Now</span>
            </button>
          )}
        </section>
      </div>

      {/* Bottom: Rate App + Share App + Privacy Policy */}
      <section aria-label="App actions" className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <button
          type="button"
          onClick={handleRateApp}
          className="min-h-[48px] px-4 py-3 rounded-2xl bg-[#13131C] border border-white/10 hover:border-[#FF6B35]/50 text-sm font-semibold text-white flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <Star className="w-4 h-4 text-[#FF6B35]" />
          <span>Rate App</span>
        </button>

        <button
          type="button"
          onClick={handleShareApp}
          className="min-h-[48px] px-4 py-3 rounded-2xl bg-[#13131C] border border-white/10 hover:border-[#FF6B35]/50 text-sm font-semibold text-white flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <Share2 className="w-4 h-4 text-[#FF6B35]" />
          <span>Share App</span>
        </button>

        <button
          type="button"
          onClick={() => setShowPrivacyModal(true)}
          className="min-h-[48px] px-4 py-3 rounded-2xl bg-[#13131C] border border-white/10 hover:border-[#FF6B35]/50 text-sm font-semibold text-white flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <Shield className="w-4 h-4 text-[#FF6B35]" />
          <span>Privacy Policy</span>
        </button>
      </section>

      {/* Privacy Policy Modal */}
      {showPrivacyModal ? (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/75 backdrop-blur-sm p-0 sm:p-4"
          onClick={() => setShowPrivacyModal(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="privacy-policy-title"
        >
          <div
            className="w-full sm:max-w-md bg-[#13131C] border-t sm:border border-white/15 rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-3">
              <h2
                id="privacy-policy-title"
                className="font-display text-xl font-bold text-white"
              >
                Privacy Policy
              </h2>
              <button
                type="button"
                onClick={() => setShowPrivacyModal(false)}
                aria-label="Close privacy policy"
                className="min-w-[44px] min-h-[44px] rounded-xl flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="mt-4 space-y-3 text-sm text-zinc-300 leading-relaxed">
              <p>
                Car Dent AI operates offline-first. Your country selection, saved
                vehicle scans, and preferences are stored exclusively on your
                device in local browser storage.
              </p>
              <p>
                No vehicle photos, personal details, or scan estimates are
                uploaded to external servers.
              </p>
              <p className="text-zinc-200 font-medium">
                We do not guarantee garage services. Users must verify rating &amp; reviews.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowPrivacyModal(false)}
              className="mt-6 w-full min-h-[48px] rounded-xl bg-[#FF6B35] hover:bg-[#ff7d4d] text-white font-semibold text-sm transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
