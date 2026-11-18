import { Car, ChevronRight, ArrowLeft, Plus, Trash2 } from 'lucide-react';
import {
  type CountryCode,
  type DentType,
  type RecentScan,
  calculateScanTotal,
  formatPrice,
  getCountryMeta,
} from '../data/pricing';

interface MyCarsScreenProps {
  country: CountryCode;
  scans: RecentScan[];
  onBackHome: () => void;
  onStartScan: () => void;
  onSelectScan: (dentType: DentType) => void;
  onRemoveScan: (id: string) => void;
}

export function MyCarsScreen({
  country,
  scans,
  onBackHome,
  onStartScan,
  onSelectScan,
  onRemoveScan,
}: MyCarsScreenProps) {
  const countryMeta = getCountryMeta(country);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={onBackHome}
            aria-label="Back to Home"
            className="min-w-[44px] min-h-[44px] rounded-xl bg-[#13131C] border border-white/10 hover:border-white/25 flex items-center justify-center text-zinc-300 hover:text-white transition-colors shrink-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="min-w-0">
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-white truncate">
              My Cars
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400">
              {scans.length} saved {scans.length === 1 ? 'vehicle' : 'vehicles'} ·{' '}
              {countryMeta.flag} {countryMeta.name}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onStartScan}
          className="min-h-[44px] px-4 py-2 rounded-xl bg-[#FF6B35] hover:bg-[#ff7d4d] text-white text-xs sm:text-sm font-semibold inline-flex items-center gap-1.5 transition-colors shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Scan</span>
        </button>
      </div>

      {scans.length === 0 ? (
        <div className="rounded-3xl bg-[#13131C] border border-white/10 p-8 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-[#FF6B35]/15 text-[#FF6B35] flex items-center justify-center mx-auto">
            <Car className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-display text-lg font-bold text-white">
              No Saved Vehicles
            </h2>
            <p className="text-sm text-zinc-400 mt-1">
              Scan your car or save an estimate to track repairs here.
            </p>
          </div>
          <button
            type="button"
            onClick={onStartScan}
            className="min-h-[48px] px-5 py-3 rounded-xl bg-[#FF6B35] hover:bg-[#ff7d4d] text-white text-sm font-semibold inline-flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Scan a Car</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {scans.map((scan) => {
            const totalCost = calculateScanTotal(scan, country);
            const formattedCost = formatPrice(totalCost, country);
            const dentLabel =
              scan.dentCount === 1 ? '1 Dent' : `${scan.dentCount} Dents`;

            return (
              <div
                key={scan.id}
                className="rounded-2xl bg-[#13131C] border border-white/10 hover:border-[#FF6B35]/50 p-5 flex flex-col justify-between gap-4 transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-[#FF6B35]/15 text-[#FF6B35] flex items-center justify-center shrink-0">
                      <Car className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <h2 className="font-display text-base font-bold text-white truncate">
                        {scan.carName}
                      </h2>
                      <p className="text-xs text-zinc-400 mt-0.5">
                        {scan.year} · {scan.scannedDate}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onRemoveScan(scan.id)}
                    aria-label={`Remove ${scan.carName}`}
                    className="min-w-[36px] min-h-[36px] rounded-lg flex items-center justify-center text-zinc-500 hover:text-red-400 hover:bg-white/5 transition-colors shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="text-xs text-zinc-400">
                  {dentLabel} · Primary:{' '}
                  <span className="text-zinc-200">{scan.primaryDentType}</span>
                </div>

                <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-3">
                  <span className="font-mono-num text-xl font-bold text-[#FF6B35]">
                    {formattedCost}
                  </span>

                  <button
                    type="button"
                    onClick={() => onSelectScan(scan.primaryDentType)}
                    className="min-h-[38px] px-3 py-1.5 rounded-xl bg-white/5 hover:bg-[#FF6B35]/15 text-xs font-semibold text-white hover:text-[#FF6B35] inline-flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <span>Estimate</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
