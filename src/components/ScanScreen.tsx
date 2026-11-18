import { useState, useEffect, useRef } from 'react';
import {
  Camera,
  ImagePlus,
  ScanLine,
  ArrowLeft,
  CheckCircle2,
  Clock,
  MapPin,
  ChevronRight,
  RotateCcw,
  Loader2,
} from 'lucide-react';
import {
  type CountryCode,
  type DentType,
  formatPrice,
  getCountryMeta,
  getDentTypeInfo,
  getPrice,
} from '../data/pricing';

const SAMPLE_SEDAN_SRC = '/src/assets/images/silver_sedan_side_view_1794889599407.jpg';

interface ScanScreenProps {
  country: CountryCode;
  onBackHome: () => void;
  onOpenEstimateDetail: (dentType: DentType) => void;
}

export function ScanScreen({
  country,
  onBackHome,
  onOpenEstimateDetail,
}: ScanScreenProps) {
  const [hasPhoto, setHasPhoto] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [imageError, setImageError] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, []);

  const handleLoadSamplePhoto = () => {
    if (isAnalyzing) return;
    setHasPhoto(true);
    setShowResult(false);
    setImageError(false);
  };

  const handleResetFrame = () => {
    if (isAnalyzing) return;
    setHasPhoto(false);
    setShowResult(false);
  };

  const handleAnalyzeDent = () => {
    if (isAnalyzing) return;
    if (!hasPhoto) {
      setHasPhoto(true);
    }
    setShowResult(false);
    setIsAnalyzing(true);

    timerRef.current = window.setTimeout(() => {
      setIsAnalyzing(false);
      setShowResult(true);
    }, 2000);
  };

  const detectedType: DentType = 'Medium Dent';
  const dentInfo = getDentTypeInfo(detectedType);
  const localCost = formatPrice(getPrice(detectedType, country), country);
  const countryMeta = getCountryMeta(country);

  return (
    <div className="space-y-6">
      {/* Top Title Row */}
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
              Scan Your Car
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400">
              Align side profile inside the frame · {countryMeta.flag} {countryMeta.name}
            </p>
          </div>
        </div>

        {hasPhoto && !isAnalyzing ? (
          <button
            type="button"
            onClick={handleResetFrame}
            className="min-h-[44px] px-3 py-2 rounded-xl bg-[#13131C] border border-white/10 hover:border-white/25 text-xs font-medium text-zinc-300 hover:text-white inline-flex items-center gap-1.5 transition-colors shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        ) : null}
      </div>

      {/* Main Layout: Camera Frame + Result Card on Desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-7 space-y-4">
          {/* Big Camera Frame — Dashed Orange Border */}
          <div className="relative aspect-[16/9] w-full rounded-3xl border-2 border-dashed border-[#FF6B35] bg-[#101018] overflow-hidden flex items-center justify-center">
            {/* Corner Viewfinder Brackets */}
            <div className="pointer-events-none absolute top-3.5 left-3.5 w-5 h-5 border-t-2 border-l-2 border-[#FF6B35] rounded-tl-md z-20" />
            <div className="pointer-events-none absolute top-3.5 right-3.5 w-5 h-5 border-t-2 border-r-2 border-[#FF6B35] rounded-tr-md z-20" />
            <div className="pointer-events-none absolute bottom-3.5 left-3.5 w-5 h-5 border-b-2 border-l-2 border-[#FF6B35] rounded-bl-md z-20" />
            <div className="pointer-events-none absolute bottom-3.5 right-3.5 w-5 h-5 border-b-2 border-r-2 border-[#FF6B35] rounded-br-md z-20" />

            {hasPhoto ? (
              <>
                {!imageError ? (
                  <img
                    src={SAMPLE_SEDAN_SRC}
                    alt="Silver sedan loaded in scanner frame"
                    referrerPolicy="no-referrer"
                    onError={() => setImageError(true)}
                    className="w-full h-full object-cover select-none"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-zinc-400 text-sm">
                    Sample Silver Sedan Loaded
                  </div>
                )}

                <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/70 to-transparent" />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/75 to-transparent" />

                {/* Pin appears when result is found */}
                {showResult ? (
                  <div
                    style={{ left: '56%', top: '56%' }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 z-20 flex items-center"
                  >
                    <span className="relative flex items-center justify-center">
                      <span className="absolute w-9 h-9 rounded-full bg-red-500/40" />
                      <span className="relative w-5 h-5 rounded-full bg-red-600 border-2 border-white shadow-[0_0_12px_rgba(239,68,68,0.95)]" />
                    </span>
                    <span className="ml-2 px-2 py-0.5 rounded-md bg-black/85 border border-red-500/60 text-[11px] font-medium text-white whitespace-nowrap">
                      Front Door · 92%
                    </span>
                  </div>
                ) : null}

                <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-[11px] text-zinc-300 z-10 pointer-events-none">
                  <span>Sample Silver Sedan</span>
                  <span>
                    {showResult ? 'Dent Detected' : 'Ready to Analyze'}
                  </span>
                </div>
              </>
            ) : (
              /* Car Silhouette Inside Camera Frame */
              <div className="flex flex-col items-center justify-center px-6 py-8 text-center">
                <svg
                  viewBox="0 0 360 130"
                  className="w-64 sm:w-80 h-auto text-[#FF6B35]/75"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    d="M32 90C24 90 18 84 18 76V67C18 61 23 55 30 53L76 44L118 22C129 17 142 15 156 15H228C247 15 264 22 278 35L304 51L332 56C339 58 344 64 344 72V82C344 87 340 90 334 90H308"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M108 90H252"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M84 47H272"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeDasharray="5 5"
                    opacity="0.55"
                  />
                  <circle
                    cx="82"
                    cy="90"
                    r="21"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  />
                  <circle
                    cx="82"
                    cy="90"
                    r="9"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    opacity="0.65"
                  />
                  <circle
                    cx="282"
                    cy="90"
                    r="21"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  />
                  <circle
                    cx="282"
                    cy="90"
                    r="9"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    opacity="0.65"
                  />
                </svg>
                <p className="mt-3 text-sm font-medium text-white">
                  Position car side view inside dashed frame
                </p>
                <p className="mt-1 text-xs text-zinc-400">
                  Tap Take Photo or Upload from Gallery below
                </p>
              </div>
            )}

            {/* Analyzing Overlay (2 seconds) */}
            {isAnalyzing ? (
              <div className="absolute inset-0 z-30 bg-black/70 backdrop-blur-[2px] flex flex-col items-center justify-center gap-3">
                <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-transparent via-[#FF6B35]/50 to-[#FF6B35] border-b-2 border-[#FF6B35] animate-scan-sweep" />
                <Loader2 className="w-8 h-8 text-[#FF6B35] animate-spin" />
                <p className="font-display text-lg font-bold text-white">
                  AI Analyzing...
                </p>
                <p className="text-xs text-zinc-300">
                  Measuring surface depth &amp; panel alignment
                </p>
              </div>
            ) : null}
          </div>

          {/* 2 Buttons: Take Photo + Upload from Gallery */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={handleLoadSamplePhoto}
              disabled={isAnalyzing}
              className="min-h-[48px] px-4 py-3 rounded-2xl bg-[#13131C] border border-white/15 hover:border-[#FF6B35]/60 text-sm font-semibold text-white flex items-center justify-center gap-2 transition-colors disabled:opacity-50 cursor-pointer"
            >
              <Camera className="w-4 h-4 text-[#FF6B35] shrink-0" />
              <span>Take Photo</span>
            </button>

            <button
              type="button"
              onClick={handleLoadSamplePhoto}
              disabled={isAnalyzing}
              className="min-h-[48px] px-4 py-3 rounded-2xl bg-[#13131C] border border-white/15 hover:border-[#FF6B35]/60 text-sm font-semibold text-white flex items-center justify-center gap-2 transition-colors disabled:opacity-50 cursor-pointer"
            >
              <ImagePlus className="w-4 h-4 text-[#FF6B35] shrink-0" />
              <span>Upload from Gallery</span>
            </button>
          </div>

          {/* Below: "Analyze Dent" Button - Neon Orange */}
          <button
            type="button"
            onClick={handleAnalyzeDent}
            disabled={isAnalyzing}
            className="w-full min-h-[56px] px-6 py-4 rounded-2xl bg-[#FF6B35] hover:bg-[#ff7d4d] active:scale-[0.99] text-white font-display font-bold text-base sm:text-lg flex items-center justify-center gap-2.5 shadow-[0_8px_28px_rgba(255,107,53,0.35)] transition-all disabled:opacity-75 cursor-pointer"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>AI Analyzing...</span>
              </>
            ) : (
              <>
                <ScanLine className="w-5 h-5" />
                <span>Analyze Dent</span>
              </>
            )}
          </button>
        </div>

        {/* Result Card Column */}
        <div className="lg:col-span-5">
          {showResult ? (
            <button
              type="button"
              onClick={() => onOpenEstimateDetail(detectedType)}
              className="w-full text-left rounded-3xl bg-[#13131C] border-2 border-[#FF6B35] p-6 shadow-[0_0_28px_rgba(255,107,53,0.18)] hover:bg-[#181824] transition-colors cursor-pointer group"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-[#FF6B35] font-semibold text-sm">
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                  <span>Scan Complete</span>
                </div>
                <span className="font-mono-num text-xs font-semibold text-emerald-400">
                  Confidence: 92%
                </span>
              </div>

              <h2 className="font-display text-2xl font-bold text-white mt-3">
                Dent Found!
              </h2>

              <div className="mt-5 space-y-3 border-t border-white/10 pt-4 text-sm">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-zinc-400">Type</span>
                  <span className="font-semibold text-white">{detectedType}</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-zinc-400">Location</span>
                  <span className="font-semibold text-white flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-red-400" />
                    <span>Front Door</span>
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-zinc-400">Confidence</span>
                  <span className="font-mono-num font-semibold text-white">92%</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-zinc-400">Repair Time</span>
                  <span className="font-semibold text-white flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#FF6B35]" />
                    <span>{dentInfo.repairTime}</span>
                  </span>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs text-zinc-400">
                    Estimated Cost ({country})
                  </p>
                  <p className="font-mono-num text-3xl font-bold text-[#FF6B35] mt-0.5">
                    {localCost}
                  </p>
                </div>
                <div className="min-h-[44px] px-4 py-2 rounded-xl bg-[#FF6B35]/15 border border-[#FF6B35]/40 text-[#FF6B35] text-xs font-semibold flex items-center gap-1.5 group-hover:bg-[#FF6B35] group-hover:text-white transition-colors">
                  <span>View Breakdown</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </button>
          ) : (
            <div className="rounded-3xl bg-[#13131C] border border-white/10 p-6 space-y-4">
              <h2 className="font-display text-lg font-bold text-white">
                How AI Scan Works
              </h2>
              <ol className="space-y-3 text-sm text-zinc-400">
                <li className="flex items-start gap-3">
                  <span className="font-mono-num text-xs font-bold text-[#FF6B35] mt-0.5">
                    01.
                  </span>
                  <span>
                    Tap <strong className="text-white">Take Photo</strong> or{' '}
                    <strong className="text-white">Upload from Gallery</strong>{' '}
                    to load your car side view.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="font-mono-num text-xs font-bold text-[#FF6B35] mt-0.5">
                    02.
                  </span>
                  <span>
                    Tap <strong className="text-white">Analyze Dent</strong> to
                    detect panel depth and damage classification offline.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="font-mono-num text-xs font-bold text-[#FF6B35] mt-0.5">
                    03.
                  </span>
                  <span>
                    Tap the result card to inspect the full itemized{' '}
                    {countryMeta.currencySymbol} cost breakdown.
                  </span>
                </li>
              </ol>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
