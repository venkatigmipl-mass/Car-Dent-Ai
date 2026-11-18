import { X, Clock, MapPin, ShieldAlert, ArrowRight } from 'lucide-react';
import {
  type CountryCode,
  type DentPin,
  type DentType,
  formatPrice,
  getDentTypeInfo,
  getPrice,
} from '../data/pricing';

interface DentPinModalProps {
  pin: DentPin | null;
  country: CountryCode;
  onClose: () => void;
  onApplyToEstimate: (dentType: DentType) => void;
}

export function DentPinModal({
  pin,
  country,
  onClose,
  onApplyToEstimate,
}: DentPinModalProps) {
  if (!pin) return null;

  const dentInfo = getDentTypeInfo(pin.dentType);
  const price = getPrice(pin.dentType, country);
  const formattedPrice = formatPrice(price, country);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/75 backdrop-blur-sm p-0 sm:p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="dent-pin-modal-title"
    >
      <div
        className="w-full sm:max-w-md bg-[#13131C] border-t sm:border border-white/15 rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mb-5 sm:hidden" />

        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-xs text-red-400 font-medium mb-1">
              <MapPin className="w-3.5 h-3.5 shrink-0" />
              <span>Detected Impact Zone</span>
              <span aria-hidden="true">·</span>
              <span>{pin.confidence}</span>
            </div>
            <h2
              id="dent-pin-modal-title"
              className="font-display text-xl font-bold text-white"
            >
              {pin.location}
            </h2>
            <p className="text-sm text-zinc-400 mt-0.5">{pin.panel}</p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close dent details"
            className="min-w-[44px] min-h-[44px] -mt-2 -mr-2 rounded-xl flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-5 pt-5 border-t border-white/10 grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-zinc-400">Classification</p>
            <p className="text-sm font-semibold text-white mt-1 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-[#FF6B35] shrink-0" />
              <span>{pin.dentType}</span>
            </p>
          </div>
          <div>
            <p className="text-xs text-zinc-400">Estimated Time</p>
            <p className="text-sm font-semibold text-white mt-1 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-zinc-300 shrink-0" />
              <span>{dentInfo.repairTime}</span>
            </p>
          </div>
        </div>

        <div className="mt-5 p-4 rounded-2xl bg-[#0A0A0F] border border-white/10 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs text-zinc-400">Local Repair Cost ({country})</p>
            <p className="text-xs text-zinc-500 mt-0.5">{pin.depthMm}</p>
          </div>
          <div className="font-mono-num text-3xl font-bold text-[#FF6B35]">
            {formattedPrice}
          </div>
        </div>

        <p className="mt-4 text-xs text-zinc-400 leading-relaxed">
          {pin.notes}
        </p>

        <div className="mt-6 flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              onApplyToEstimate(pin.dentType);
              onClose();
            }}
            className="flex-1 min-h-[48px] px-4 py-3 rounded-xl bg-[#FF6B35] hover:bg-[#ff7d4d] text-white font-semibold text-sm flex items-center justify-center gap-2 transition-colors active:scale-[0.98]"
          >
            <span>Load in Estimate Card</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
