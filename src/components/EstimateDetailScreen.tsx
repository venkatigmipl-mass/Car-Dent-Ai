import { useState, type FormEvent } from 'react';
import {
  ArrowLeft,
  Clock,
  MapPin,
  Wrench,
  Paintbrush,
  Sparkles,
  Check,
  CarFront,
  Star,
  Phone,
  Navigation,
  LocateFixed,
  Search,
  Loader2,
  CheckCircle2,
} from 'lucide-react';
import {
  type CountryCode,
  type DentType,
  DENT_TYPES,
  NEARBY_GARAGES,
  formatPrice,
  getCostBreakdown,
  getCountryMeta,
  getDentLocationInfo,
  getDentTypeInfo,
  getPrice,
} from '../data/pricing';
import {
  type SavedUserLocation,
  getCoordinatesForCity,
  getGarageWithRealDistance,
  getSavedUserLocation,
  resolveCityFromCoords,
  saveUserLocation,
} from '../data/location';

const SEDAN_IMAGE_SRC = '/src/assets/images/silver_sedan_side_view_1794889599407.jpg';

interface EstimateDetailScreenProps {
  country: CountryCode;
  dentType: DentType;
  onSelectDentType: (dentType: DentType) => void;
  onSaveToMyCars: (dentType: DentType) => void;
  onBackHome: () => void;
}

export function EstimateDetailScreen({
  country,
  dentType,
  onSelectDentType,
  onSaveToMyCars,
  onBackHome,
}: EstimateDetailScreenProps) {
  const [imageError, setImageError] = useState(false);
  const [savedToast, setSavedToast] = useState(false);
  const [calledGarage, setCalledGarage] = useState<string | null>(null);

  const [userLocation, setUserLocation] = useState<SavedUserLocation | null>(
    () => getSavedUserLocation()
  );
  const [isLocating, setIsLocating] = useState(false);
  const [gpsDenied, setGpsDenied] = useState(false);
  const [locationErrorMsg, setLocationErrorMsg] = useState<string | null>(null);
  const [showCitySearch, setShowCitySearch] = useState(false);
  const [cityInput, setCityInput] = useState('');

  const countryMeta = getCountryMeta(country);
  const dentInfo = getDentTypeInfo(dentType);
  const locationInfo = getDentLocationInfo(dentType);
  const breakdown = getCostBreakdown(dentType, country);
  const basePrice = getPrice(dentType, country);

  const handleSave = () => {
    onSaveToMyCars(dentType);
    setSavedToast(true);
    window.setTimeout(() => setSavedToast(false), 2500);
  };

  const handleCallFeedback = (garageName: string) => {
    setCalledGarage(garageName);
    window.setTimeout(() => setCalledGarage(null), 2600);
  };

  const handleUseMyLocation = () => {
    if (isLocating) return;
    setLocationErrorMsg(null);
    setGpsDenied(false);

    if (!('geolocation' in navigator)) {
      setGpsDenied(true);
      setShowCitySearch(true);
      setLocationErrorMsg('GPS is not supported on this device. Search by city instead.');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const resolvedCity = await resolveCityFromCoords(latitude, longitude);
        const saved: SavedUserLocation = {
          mode: 'gps',
          city: resolvedCity,
          lat: latitude,
          lng: longitude,
          updatedAt: new Date().toISOString(),
        };
        saveUserLocation(saved);
        setUserLocation(saved);
        setShowCitySearch(false);
        setGpsDenied(false);
        setIsLocating(false);
      },
      (err) => {
        setIsLocating(false);
        setGpsDenied(true);
        setShowCitySearch(true);
        if (err.code === err.PERMISSION_DENIED) {
          setLocationErrorMsg('Location permission denied. Search by city below.');
        } else {
          setLocationErrorMsg('Unable to read GPS signal. Search by city below.');
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  };

  const handleCitySearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = cityInput.trim();
    if (!trimmed) return;

    const coords = getCoordinatesForCity(trimmed, country);
    const saved: SavedUserLocation = {
      mode: 'city',
      city: coords.city,
      lat: coords.lat,
      lng: coords.lng,
      updatedAt: new Date().toISOString(),
    };
    saveUserLocation(saved);
    setUserLocation(saved);
    setShowCitySearch(false);
    setGpsDenied(false);
    setLocationErrorMsg(null);
  };

  return (
    <div className="space-y-7">
      {/* Header Row — Full "Estimate" title with zero truncation */}
      <div className="flex flex-wrap items-center justify-between gap-3">
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
              Estimate
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400">
              {dentType} · {locationInfo.location} · {countryMeta.flag}{' '}
              {countryMeta.name}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSave}
          className="min-h-[44px] px-4 py-2 rounded-xl bg-[#FF6B35]/15 border border-[#FF6B35]/40 hover:bg-[#FF6B35] text-[#FF6B35] hover:text-white text-xs sm:text-sm font-semibold inline-flex items-center gap-2 transition-colors shrink-0 cursor-pointer"
        >
          {savedToast ? (
            <>
              <Check className="w-4 h-4" />
              <span>Saved</span>
            </>
          ) : (
            <>
              <CarFront className="w-4 h-4" />
              <span>Save to My Cars</span>
            </>
          )}
        </button>
      </div>

      {/* Dent Type Quick Switcher */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {DENT_TYPES.map((item) => {
          const isActive = item.type === dentType;
          return (
            <button
              key={item.type}
              type="button"
              onClick={() => onSelectDentType(item.type)}
              className={`min-h-[40px] px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 border transition-colors cursor-pointer ${
                isActive
                  ? 'bg-[#FF6B35] border-[#FF6B35] text-white'
                  : 'bg-[#13131C] border-white/10 text-zinc-300 hover:border-white/25'
              }`}
            >
              {item.type}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Top: Car Photo + Dent Location Pin */}
        <div className="lg:col-span-7">
          <div className="relative rounded-3xl overflow-hidden border-2 border-[#FF6B35] bg-[#101018] shadow-[0_0_28px_rgba(255,107,53,0.18)]">
            <div className="relative aspect-[16/9] w-full bg-[#0A0A0F]">
              {!imageError ? (
                <img
                  src={SEDAN_IMAGE_SRC}
                  alt={`Silver sedan showing ${locationInfo.location} dent location pin`}
                  referrerPolicy="no-referrer"
                  onError={() => setImageError(true)}
                  className="w-full h-full object-cover select-none"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-zinc-400 text-sm">
                  Silver Sedan Inspection View
                </div>
              )}

              <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/75 to-transparent" />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/80 to-transparent" />

              <div className="absolute top-3.5 left-4 right-4 flex items-center justify-between text-xs text-white/95 pointer-events-none">
                <span>{locationInfo.panel}</span>
                <span className="font-medium text-[#FF6B35] flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{dentInfo.repairTime}</span>
                </span>
              </div>

              {/* Dent Location Pin */}
              <div
                style={{
                  left: `${locationInfo.xPercent}%`,
                  top: `${locationInfo.yPercent}%`,
                }}
                className="absolute -translate-x-1/2 -translate-y-1/2 z-20 flex items-center"
              >
                <span className="relative flex items-center justify-center">
                  <span className="absolute w-10 h-10 rounded-full bg-red-500/35" />
                  <span className="relative w-5 h-5 rounded-full bg-red-600 border-2 border-white shadow-[0_0_12px_rgba(239,68,68,0.95)]" />
                </span>
                <span className="ml-2 px-2.5 py-1 rounded-lg bg-black/85 border border-red-500/60 text-xs font-semibold text-white whitespace-nowrap inline-flex items-center gap-1.5 shadow-lg">
                  <MapPin className="w-3.5 h-3.5 text-red-400" />
                  <span>{locationInfo.location}</span>
                </span>
              </div>

              <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs text-zinc-300 pointer-events-none">
                <span>{dentInfo.description}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Middle: Cost Breakdown Table — Dent Repair + Painting + Polish + Total */}
        <div className="lg:col-span-5 rounded-3xl bg-[#13131C] border border-white/10 p-6">
          <div className="flex items-center justify-between gap-3 pb-4 border-b border-white/10">
            <div>
              <h2 className="font-display text-xl font-bold text-white">
                Cost Breakdown
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                {dentType} · {countryMeta.currencyCode} ({countryMeta.currencySymbol})
              </p>
            </div>
            <span className="text-xs font-medium text-zinc-300 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#FF6B35]" />
              <span>{dentInfo.repairTime}</span>
            </span>
          </div>

          <div className="mt-2 overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-xs text-zinc-400">
                  <th className="py-3 font-medium">Service Item</th>
                  <th className="py-3 font-medium text-right">Estimate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 text-sm">
                <tr>
                  <td className="py-4 pr-3">
                    <div className="flex items-center gap-2.5 font-medium text-white">
                      <Wrench className="w-4 h-4 text-[#FF6B35] shrink-0" />
                      <span>Dent Repair</span>
                    </div>
                    <p className="text-xs text-zinc-400 mt-0.5 pl-6.5">
                      Panel pulling &amp; metal straightening
                    </p>
                  </td>
                  <td className="py-4 text-right font-mono-num font-semibold text-white whitespace-nowrap">
                    {formatPrice(breakdown.dentRepair, country)}
                  </td>
                </tr>

                <tr>
                  <td className="py-4 pr-3">
                    <div className="flex items-center gap-2.5 font-medium text-white">
                      <Paintbrush className="w-4 h-4 text-[#FF6B35] shrink-0" />
                      <span>Painting</span>
                    </div>
                    <p className="text-xs text-zinc-400 mt-0.5 pl-6.5">
                      Primer, color match &amp; base coat
                    </p>
                  </td>
                  <td className="py-4 text-right font-mono-num font-semibold text-white whitespace-nowrap">
                    {formatPrice(breakdown.painting, country)}
                  </td>
                </tr>

                <tr>
                  <td className="py-4 pr-3">
                    <div className="flex items-center gap-2.5 font-medium text-white">
                      <Sparkles className="w-4 h-4 text-[#FF6B35] shrink-0" />
                      <span>Polish</span>
                    </div>
                    <p className="text-xs text-zinc-400 mt-0.5 pl-6.5">
                      Clearcoat blend &amp; buff finish
                    </p>
                  </td>
                  <td className="py-4 text-right font-mono-num font-semibold text-white whitespace-nowrap">
                    {formatPrice(breakdown.polish, country)}
                  </td>
                </tr>
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-white/15">
                  <td className="pt-4 font-display text-base font-bold text-white">
                    Total
                  </td>
                  <td className="pt-4 text-right font-mono-num text-3xl font-bold text-[#FF6B35] whitespace-nowrap">
                    {formatPrice(breakdown.total, country)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>

      {/* Nearby Garages Section — GPS Location Permission + 3 Garages */}
      <section aria-labelledby="nearby-garages-heading" className="space-y-4">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <div>
            <h2
              id="nearby-garages-heading"
              className="font-display text-xl font-bold text-white"
            >
              Nearby Garages
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              Verified repair centers for {dentType} · {countryMeta.flag}{' '}
              {countryMeta.name}
            </p>
          </div>
          {calledGarage ? (
            <span className="text-xs font-medium text-[#FF6B35]">
              Dialing {calledGarage}...
            </span>
          ) : null}
        </div>

        {/* Location Permission / Detected Status / Search by City */}
        {!userLocation || showCitySearch ? (
          <div className="rounded-2xl bg-[#13131C] border border-[#FF6B35]/50 p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <h3 className="font-display text-base font-bold text-white flex items-center gap-2">
                  <LocateFixed className="w-4 h-4 text-[#FF6B35]" />
                  <span>
                    {gpsDenied ? 'Search by City' : 'Allow Location?'}
                  </span>
                </h3>
                <p className="text-xs text-zinc-400">
                  {locationErrorMsg
                    ? locationErrorMsg
                    : 'Share your GPS location to calculate real distances to nearby dent repair shops.'}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                <button
                  type="button"
                  onClick={handleUseMyLocation}
                  disabled={isLocating}
                  className="min-h-[44px] px-4 py-2.5 rounded-xl bg-[#FF6B35] hover:bg-[#ff7d4d] text-white text-xs sm:text-sm font-semibold inline-flex items-center gap-2 transition-colors cursor-pointer disabled:opacity-70"
                >
                  {isLocating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Detecting GPS...</span>
                    </>
                  ) : (
                    <>
                      <LocateFixed className="w-4 h-4" />
                      <span>Use My Location</span>
                    </>
                  )}
                </button>

                {!showCitySearch ? (
                  <button
                    type="button"
                    onClick={() => setShowCitySearch(true)}
                    className="min-h-[44px] px-3.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-zinc-200 inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Search className="w-3.5 h-3.5 text-[#FF6B35]" />
                    <span>Search by City</span>
                  </button>
                ) : null}
              </div>
            </div>

            {showCitySearch || gpsDenied ? (
              <form
                onSubmit={handleCitySearchSubmit}
                className="pt-3 border-t border-white/10 flex flex-col sm:flex-row gap-2.5"
              >
                <label htmlFor="city-search-input" className="sr-only">
                  Search by City
                </label>
                <input
                  id="city-search-input"
                  type="text"
                  value={cityInput}
                  onChange={(e) => setCityInput(e.target.value)}
                  placeholder="Enter City Name (e.g. Mumbai, Austin, London)"
                  className="flex-1 min-h-[44px] px-3.5 py-2 rounded-xl bg-[#0A0A0F] border border-white/15 focus:border-[#FF6B35] focus:outline-none text-sm text-white placeholder:text-zinc-500"
                />
                <button
                  type="submit"
                  className="min-h-[44px] px-5 py-2 rounded-xl bg-[#FF6B35] hover:bg-[#ff7d4d] text-white text-xs sm:text-sm font-semibold inline-flex items-center justify-center gap-2 transition-colors cursor-pointer shrink-0"
                >
                  <Search className="w-4 h-4" />
                  <span>Find Garages</span>
                </button>
              </form>
            ) : null}
          </div>
        ) : (
          <div className="rounded-2xl bg-[#13131C] border border-white/10 px-4 py-3 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <div className="text-xs sm:text-sm text-white truncate">
                <span className="font-semibold">
                  Your Location: {userLocation.mode === 'gps' ? 'Detected' : 'City'}
                </span>{' '}
                <span className="text-zinc-300">· {userLocation.city}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleUseMyLocation}
                disabled={isLocating}
                className="min-h-[36px] px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-medium text-zinc-200 inline-flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <LocateFixed className="w-3.5 h-3.5 text-[#FF6B35]" />
                <span>{isLocating ? 'Updating...' : 'Refresh GPS'}</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setCityInput(userLocation.city);
                  setShowCitySearch(true);
                }}
                className="min-h-[36px] px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-medium text-zinc-200 transition-colors cursor-pointer"
              >
                Search by City
              </button>
            </div>
          </div>
        )}

        {/* 3 Garages Grid */}
        {userLocation ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {NEARBY_GARAGES.map((garage) => {
              const garageQuote = Math.round(basePrice * garage.priceFactor);
              const formattedQuote = formatPrice(garageQuote, country);
              const geoInfo = getGarageWithRealDistance(garage, userLocation);

              return (
                <div
                  key={garage.id}
                  className="rounded-2xl bg-[#13131C] border border-white/10 hover:border-[#FF6B35]/50 p-5 flex flex-col justify-between gap-4 transition-colors"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-display text-base font-bold text-white">
                          {garage.name}
                        </h3>
                        <p className="text-xs text-zinc-400 mt-0.5">
                          {garage.specialty}
                        </p>
                      </div>
                      <span className="font-mono-num text-lg font-bold text-[#FF6B35] shrink-0">
                        {formattedQuote}
                      </span>
                    </div>

                    <div className="mt-3 flex items-center gap-3 text-xs text-zinc-300">
                      <span className="font-mono-num">{geoInfo.distanceKm}</span>
                      <span aria-hidden="true">·</span>
                      <span className="inline-flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 text-[#FF6B35] fill-[#FF6B35]" />
                        <span>{garage.rating} Stars</span>
                      </span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-white/10 grid grid-cols-2 gap-2.5">
                    <a
                      href={`tel:${garage.phone}`}
                      onClick={() => handleCallFeedback(garage.name)}
                      className="min-h-[44px] px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-white flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5 text-[#FF6B35]" />
                      <span>Call</span>
                    </a>

                    <a
                      href={geoInfo.mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="min-h-[44px] px-3 py-2 rounded-xl bg-[#FF6B35] hover:bg-[#ff7d4d] text-xs font-semibold text-white flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      <span>Directions</span>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        ) : null}

        {/* Garage Disclaimer Box */}
        <div
          role="note"
          aria-label="Important garage disclaimer"
          className="rounded-2xl bg-[#FFF3CD] text-black p-4 sm:p-5 border border-amber-300/60"
        >
          <div className="flex items-start gap-3">
            <span className="text-lg leading-none shrink-0 mt-0.5" aria-hidden="true">
              ⚠️
            </span>
            <div className="space-y-1">
              <h3 className="font-display text-sm sm:text-base font-bold text-black">
                Important - Please Read
              </h3>
              <p className="text-xs sm:text-sm text-black/90 leading-relaxed">
                Please check Google Rating, Reviews and Photos before visiting any garage. Prices shown are estimates only and may vary by garage. Car Dent AI is not responsible for repair quality, pricing or service at third-party garages. Always confirm price before repair.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Estimate Detail Bottom Disclaimer */}
      <p className="text-xs text-zinc-400 text-center pt-1 pb-2">
        Estimate is AI-generated for reference only. Actual cost may vary. Check garage reviews before booking.
      </p>
    </div>
  );
}
