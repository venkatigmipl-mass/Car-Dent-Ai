import { Car, Check, Globe, ArrowLeft } from 'lucide-react';
import { COUNTRIES, type CountryCode, getPrice, formatPrice } from '../data/pricing';

interface CountrySelectProps {
  currentCountry: CountryCode | null;
  onSelectCountry: (country: CountryCode) => void;
  onCancel?: () => void;
}

export function CountrySelect({
  currentCountry,
  onSelectCountry,
  onCancel,
}: CountrySelectProps) {
  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white flex flex-col justify-between px-5 py-8 sm:py-12">
      <div className="w-full max-w-xl mx-auto">
        {currentCountry && onCancel ? (
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex items-center gap-2 min-h-[44px] px-3 -ml-3 text-sm font-medium text-zinc-400 hover:text-white transition-colors rounded-xl"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </button>
        ) : null}

        <div className="mt-4 sm:mt-6 flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-[#FF6B35]/15 border border-[#FF6B35]/40 flex items-center justify-center text-[#FF6B35]">
            <Car className="w-6 h-6" />
          </div>
          <div>
            <p className="font-display text-lg font-bold tracking-tight text-white">
              Car Dent AI
            </p>
            <p className="text-xs text-zinc-400">Snap. Detect. Fix.</p>
          </div>
        </div>

        <div className="mt-8 sm:mt-10">
          <div className="inline-flex items-center gap-2 text-xs font-medium text-[#FF6B35] mb-3">
            <Globe className="w-4 h-4" />
            <span>Global Repair Pricing</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-white text-balance">
            Where are you?
          </h1>
          <p className="mt-2.5 text-sm sm:text-base text-zinc-400 leading-relaxed max-w-md">
            Select your country to calibrate repair shop estimates and local currency pricing offline.
          </p>
        </div>

        <div className="mt-8 space-y-3" role="radiogroup" aria-label="Select country">
          {COUNTRIES.map((country) => {
            const isSelected = currentCountry === country.id;
            const samplePrice = formatPrice(
              getPrice('Small Dent', country.id),
              country.id
            );

            return (
              <button
                key={country.id}
                type="button"
                onClick={() => onSelectCountry(country.id)}
                className={`w-full min-h-[68px] px-4 py-3.5 rounded-2xl border text-left flex items-center justify-between gap-4 transition-all duration-150 active:scale-[0.99] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF6B35] ${
                  isSelected
                    ? 'bg-[#181822] border-[#FF6B35] shadow-[0_0_24px_rgba(255,107,53,0.16)]'
                    : 'bg-[#12121A] border-white/10 hover:border-white/25 hover:bg-[#161620]'
                }`}
              >
                <div className="flex items-center gap-4 min-w-0">
                  <span
                    className="text-3xl leading-none select-none shrink-0"
                    role="img"
                    aria-label={`${country.name} flag`}
                  >
                    {country.flag}
                  </span>
                  <div className="min-w-0">
                    <div className="font-display text-base sm:text-lg font-semibold text-white truncate">
                      {country.name}
                    </div>
                    <div className="text-xs text-zinc-400 mt-0.5 flex items-center gap-1.5">
                      <span>{country.currencyCode}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono-num">
                        Small dent from {samplePrice}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="font-mono-num text-sm font-semibold text-[#FF6B35]">
                    {country.currencySymbol}
                  </span>
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center border transition-colors ${
                      isSelected
                        ? 'bg-[#FF6B35] border-[#FF6B35] text-white'
                        : 'border-white/20 text-transparent'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <footer className="w-full max-w-xl mx-auto pt-8 text-center">
        <p className="text-xs text-zinc-500">
          Saved locally on your device · Works 100% offline
        </p>
      </footer>
    </div>
  );
}
