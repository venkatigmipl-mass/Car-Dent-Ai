import { useEffect, useState } from 'react';
import {
  Car,
  ScanLine,
  Clock,
  ChevronRight,
  Crown,
  Sparkles,
  MapPin,
} from 'lucide-react';
import {
  type CountryCode,
  type DentPin,
  type DentType,
  type CarDentStorageState,
  DENT_TYPES,
  HERO_DENT_PINS,
  calculateScanTotal,
  formatPrice,
  getCountryMeta,
  getDentTypeInfo,
  getPrice,
  getSavedCountry,
  loadAppState,
  saveAppState,
  saveCountry,
} from './data/pricing';
import { CountrySelect } from './components/CountrySelect';
import { DentPinModal } from './components/DentPinModal';
import { BottomNav, type NavTab } from './components/BottomNav';
import { showBannerAd } from './components/BannerAd';
import { ScanScreen } from './components/ScanScreen';
import { EstimateDetailScreen } from './components/EstimateDetailScreen';
import { MyCarsScreen } from './components/MyCarsScreen';
import { ProfileScreen } from './components/ProfileScreen';

const SEDAN_IMAGE_SRC = '/src/assets/images/silver_sedan_side_view_1794889599407.jpg';

export default function App() {
  const [country, setCountry] = useState<CountryCode | null>(() => getSavedCountry());
  const [showCountryPicker, setShowCountryPicker] = useState<boolean>(
    () => getSavedCountry() === null
  );
  const [appState, setAppState] = useState<CarDentStorageState>(() => loadAppState());
  const [activePin, setActivePin] = useState<DentPin | null>(null);
  const [activeTab, setActiveTab] = useState<NavTab>('Home');
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    saveAppState(appState);
  }, [appState]);

  const handleSelectCountry = (selected: CountryCode) => {
    saveCountry(selected);
    setCountry(selected);
    setShowCountryPicker(false);
  };

  const handleSelectDentType = (dentType: DentType) => {
    setAppState((prev) => ({
      ...prev,
      selectedDentType: dentType,
      lastUpdatedAt: new Date().toISOString(),
    }));
  };

  const handleOpenEstimateDetail = (dentType: DentType) => {
    handleSelectDentType(dentType);
    setActiveTab('Estimate');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenScanScreen = () => {
    setActiveTab('Scan');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSaveToMyCars = (dentType: DentType) => {
    const newScan = {
      id: `scan-${Date.now()}`,
      carName: 'Silver Sedan',
      year: '2024 Scan',
      dentCount: 1,
      primaryDentType: dentType,
      dentTypes: [dentType],
      scannedDate: 'Just now',
    };

    setAppState((prev) => ({
      ...prev,
      selectedDentType: dentType,
      recentScans: [newScan, ...prev.recentScans],
      lastUpdatedAt: new Date().toISOString(),
    }));
  };

  const handleRemoveScan = (id: string) => {
    setAppState((prev) => ({
      ...prev,
      recentScans: prev.recentScans.filter((scan) => scan.id !== id),
      lastUpdatedAt: new Date().toISOString(),
    }));
  };

  const handleToggleNotifications = () => {
    setAppState((prev) => ({
      ...prev,
      notificationsEnabled: !prev.notificationsEnabled,
      lastUpdatedAt: new Date().toISOString(),
    }));
  };

  const handleUpgradePremium = () => {
    setAppState((prev) => ({
      ...prev,
      isPremium: true,
      lastUpdatedAt: new Date().toISOString(),
    }));
  };

  const handleClearHistory = () => {
    setAppState((prev) => ({
      ...prev,
      recentScans: [],
      lastUpdatedAt: new Date().toISOString(),
    }));
  };

  const handleBottomTabClick = (tab: NavTab) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (showCountryPicker || !country) {
    return (
      <CountrySelect
        currentCountry={country}
        onSelectCountry={handleSelectCountry}
        onCancel={country ? () => setShowCountryPicker(false) : undefined}
      />
    );
  }

  const countryMeta = getCountryMeta(country);
  const selectedInfo = getDentTypeInfo(appState.selectedDentType);
  const selectedPrice = getPrice(appState.selectedDentType, country);
  const formattedTotalCost = formatPrice(selectedPrice, country);

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white pb-24">
      {/* Top Bar */}
      <header className="border-b border-white/10 bg-[#0A0A0F]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Brand Logo + Car Icon */}
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-[#FF6B35] flex items-center justify-center text-white shrink-0 shadow-[0_0_20px_rgba(255,107,53,0.35)]">
              <Car className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <span className="font-display text-lg font-bold tracking-tight text-white whitespace-nowrap block leading-none">
                Car Dent AI
              </span>
              <span className="text-[11px] text-zinc-400 whitespace-nowrap block mt-1 leading-none">
                Snap. Detect. Fix.
              </span>
            </div>
          </div>

          {/* Top Right: Change Country + Country Flag + Premium Badge */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => setShowCountryPicker(true)}
              aria-label={`Change country (currently ${countryMeta.name})`}
              className="min-h-[44px] px-3 py-2 rounded-xl bg-[#14141E] border border-white/10 hover:border-[#FF6B35]/60 flex items-center gap-2 text-xs sm:text-sm font-medium text-white transition-colors whitespace-nowrap shrink-0"
            >
              <span className="text-base leading-none" aria-hidden="true">
                {countryMeta.flag}
              </span>
              <span>{countryMeta.name}</span>
              <span className="text-zinc-400 text-[11px] hidden sm:inline">
                Change
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('Profile')}
              className="min-h-[36px] px-2.5 py-1.5 rounded-xl bg-[#FF6B35]/15 border border-[#FF6B35]/40 hover:bg-[#FF6B35]/25 text-[#FF6B35] flex items-center gap-1.5 text-xs font-semibold whitespace-nowrap shrink-0 transition-colors cursor-pointer"
            >
              <Crown className="w-3.5 h-3.5 shrink-0" />
              <span>{appState.isPremium ? 'Pro' : 'Premium'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-5 sm:pt-7 space-y-6 sm:space-y-8">
        {activeTab === 'Scan' ? (
          <ScanScreen
            country={country}
            onBackHome={() => setActiveTab('Home')}
            onOpenEstimateDetail={handleOpenEstimateDetail}
          />
        ) : activeTab === 'Estimate' ? (
          <EstimateDetailScreen
            country={country}
            dentType={appState.selectedDentType}
            onSelectDentType={handleSelectDentType}
            onSaveToMyCars={handleSaveToMyCars}
            onBackHome={() => setActiveTab('Home')}
          />
        ) : activeTab === 'My Cars' ? (
          <MyCarsScreen
            country={country}
            scans={appState.recentScans}
            onBackHome={() => setActiveTab('Home')}
            onStartScan={handleOpenScanScreen}
            onSelectScan={handleOpenEstimateDetail}
            onRemoveScan={handleRemoveScan}
          />
        ) : activeTab === 'Profile' ? (
          <ProfileScreen
            country={country}
            scans={appState.recentScans}
            notificationsEnabled={appState.notificationsEnabled}
            isPremium={appState.isPremium}
            onToggleNotifications={handleToggleNotifications}
            onUpgradePremium={handleUpgradePremium}
            onClearHistory={handleClearHistory}
            onChangeCountry={() => setShowCountryPicker(true)}
            onBackHome={() => setActiveTab('Home')}
          />
        ) : (
          <>
            {/* Hero Scanner + Estimate Card Split */}
            <section
              aria-label="Dent Scanner Hero and Estimate Card"
              className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch"
            >
              {/* Big Car Photo Card with Orange Neon Border & 2 Red Dent Pins */}
              <div className="lg:col-span-7 flex flex-col">
                <div className="relative rounded-3xl overflow-hidden border-2 border-[#FF6B35] bg-[#101018] shadow-[0_0_32px_rgba(255,107,53,0.22)]">
                  <div className="relative aspect-[16/9] w-full bg-[#0A0A0F]">
                    {!imageError ? (
                      <img
                        src={SEDAN_IMAGE_SRC}
                        alt="Silver sedan side profile showing front door and rear bumper dent pins"
                        referrerPolicy="no-referrer"
                        onError={() => setImageError(true)}
                        className="w-full h-full object-cover select-none"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#12121C] to-[#0A0A0F] text-zinc-400 gap-2 p-6">
                        <Car className="w-12 h-12 text-[#FF6B35]" />
                        <p className="text-sm font-medium text-white">
                          Silver Sedan Side View
                        </p>
                      </div>
                    )}

                    {/* Top gradient scrim for legibility */}
                    <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/75 via-black/30 to-transparent" />
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/80 via-black/35 to-transparent" />

                    {/* Top overlay label */}
                    <div className="absolute top-3.5 left-4 right-4 flex items-center justify-between gap-2 pointer-events-none">
                      <span className="text-xs font-medium text-white/95">
                        2024 Silver Sedan · Side Scan
                      </span>
                      <span className="text-xs font-mono-num text-[#FF6B35] font-semibold">
                        2 Dents Detected
                      </span>
                    </div>

                    {/* 2 Red Dent Pins: Front Door + Rear Bumper */}
                    {HERO_DENT_PINS.map((pin) => {
                      const pinCost = formatPrice(
                        getPrice(pin.dentType, country),
                        country
                      );

                      return (
                        <button
                          key={pin.id}
                          type="button"
                          onClick={() => setActivePin(pin)}
                          style={{
                            left: `${pin.xPercent}%`,
                            top: `${pin.yPercent}%`,
                          }}
                          aria-label={`${pin.location} dent pin, ${pin.dentType}, ${pinCost}. Tap for details.`}
                          className="absolute -translate-x-1/2 -translate-y-1/2 min-w-[44px] min-h-[44px] flex items-center justify-center group focus-visible:outline-2 focus-visible:outline-white rounded-full"
                        >
                          <span className="relative flex items-center justify-center">
                            <span className="absolute w-8 h-8 rounded-full bg-red-500/35 group-hover:scale-125 transition-transform" />
                            <span className="relative w-5 h-5 rounded-full bg-red-600 border-2 border-white shadow-[0_0_12px_rgba(239,68,68,0.9)] flex items-center justify-center">
                              <span className="w-1.5 h-1.5 rounded-full bg-white" />
                            </span>
                          </span>
                          <span className="hidden sm:inline-flex items-center gap-1 ml-1.5 px-2 py-0.5 rounded-md bg-black/85 border border-red-500/60 text-[11px] font-medium text-white whitespace-nowrap shadow-lg">
                            <MapPin className="w-3 h-3 text-red-400" />
                            <span>{pin.location}</span>
                          </span>
                        </button>
                      );
                    })}

                    {/* Bottom overlay helper */}
                    <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-[11px] text-zinc-300 pointer-events-none">
                      <span>Tap red pins for local dent estimate</span>
                      <span className="font-mono-num text-white/90">
                        {countryMeta.flag} {countryMeta.currencyCode}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Big Neon Orange "Scan My Car" CTA below Hero Photo */}
                <button
                  type="button"
                  onClick={handleOpenScanScreen}
                  className="mt-4 w-full min-h-[56px] px-6 py-4 rounded-2xl bg-[#FF6B35] hover:bg-[#ff7d4d] active:scale-[0.99] text-white font-display font-bold text-base sm:text-lg flex items-center justify-center gap-3 shadow-[0_8px_28px_rgba(255,107,53,0.35)] transition-all cursor-pointer"
                >
                  <ScanLine className="w-5 h-5" />
                  <span>Scan My Car</span>
                </button>
              </div>

              {/* Estimate Card */}
              <div
                id="estimate-card"
                className="lg:col-span-5 rounded-3xl bg-[#13131C] border border-white/10 p-5 sm:p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-medium text-zinc-400">
                      Instant Repair Estimate
                    </span>
                    <span className="text-xs font-medium text-zinc-300">
                      {countryMeta.flag} {countryMeta.name}
                    </span>
                  </div>

                  <h1 className="font-display text-2xl sm:text-3xl font-bold text-white mt-2">
                    {selectedInfo.type}
                  </h1>
                  <p className="text-sm text-zinc-400 mt-1.5 leading-relaxed">
                    {selectedInfo.description}
                  </p>

                  {/* Big Orange Total Cost */}
                  <div className="mt-6 pt-5 border-t border-white/10">
                    <p className="text-xs text-zinc-400">Estimated Total Cost</p>
                    <div className="mt-1 flex items-baseline gap-2">
                      <span className="font-mono-num text-4xl sm:text-5xl font-bold tracking-tight text-[#FF6B35]">
                        {formattedTotalCost}
                      </span>
                      <span className="text-xs font-medium text-zinc-400">
                        {countryMeta.currencyCode}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-white/10 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-zinc-400">Repair Time</p>
                    <p className="text-sm font-semibold text-white mt-1 flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-[#FF6B35]" />
                      <span>{selectedInfo.repairTime}</span>
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-zinc-400">Damage Severity</p>
                    <p className="text-sm font-semibold text-white mt-1 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-zinc-300" />
                      <span>{selectedInfo.severity}</span>
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Dent Types Row — 4 Cards */}
            <section aria-labelledby="dent-types-heading">
              <div className="flex items-baseline justify-between gap-4 mb-3.5">
                <h2
                  id="dent-types-heading"
                  className="font-display text-lg sm:text-xl font-bold text-white"
                >
                  Dent Types
                </h2>
                <span className="text-xs text-zinc-400">
                  Tap a card for estimate detail
                </span>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {DENT_TYPES.map((dent) => {
                  const isSelected = appState.selectedDentType === dent.type;
                  const price = getPrice(dent.type, country);
                  const formatted = formatPrice(price, country);

                  return (
                    <button
                      key={dent.type}
                      type="button"
                      onClick={() => handleOpenEstimateDetail(dent.type)}
                      aria-pressed={isSelected}
                      className={`min-h-[112px] p-4 rounded-2xl border text-left flex flex-col justify-between transition-all duration-150 active:scale-[0.98] cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF6B35] ${
                        isSelected
                          ? 'bg-[#1A1618] border-[#FF6B35] shadow-[0_0_20px_rgba(255,107,53,0.18)]'
                          : 'bg-[#13131C] border-white/10 hover:border-white/25'
                      }`}
                    >
                      <div>
                        <div className="text-sm font-semibold text-white">
                          {dent.type}
                        </div>
                        <div className="text-xs text-zinc-400 mt-1">
                          {dent.repairTime}
                        </div>
                      </div>

                      <div className="mt-4 flex items-center justify-between gap-2">
                        <span
                          className={`font-mono-num text-xl font-bold ${
                            isSelected ? 'text-[#FF6B35]' : 'text-white'
                          }`}
                        >
                          {formatted}
                        </span>
                        <ChevronRight
                          className={`w-4 h-4 ${
                            isSelected ? 'text-[#FF6B35]' : 'text-zinc-500'
                          }`}
                        />
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Recent Scans — 3 Saved Cars Grid */}
            <section id="recent-scans" aria-labelledby="recent-scans-heading">
              <div className="flex items-baseline justify-between gap-4 mb-3.5">
                <h2
                  id="recent-scans-heading"
                  className="font-display text-lg sm:text-xl font-bold text-white"
                >
                  Recent Scans
                </h2>
                <span className="text-xs text-zinc-400">
                  {Math.min(appState.recentScans.length, 3)} Saved Cars · {countryMeta.name}
                </span>
              </div>

              {appState.recentScans.length === 0 ? (
                <div className="rounded-2xl bg-[#13131C] border border-white/10 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-white">
                      No recent scans saved
                    </p>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      Run a quick scan to save a vehicle repair estimate.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleOpenScanScreen}
                    className="min-h-[44px] px-4 py-2 rounded-xl bg-[#FF6B35] hover:bg-[#ff7d4d] text-white text-xs font-semibold shrink-0 transition-colors cursor-pointer"
                  >
                    Scan My Car
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                  {appState.recentScans.slice(0, 3).map((scan) => {
                    const totalCost = calculateScanTotal(scan, country);
                    const formattedCost = formatPrice(totalCost, country);
                    const dentLabel =
                      scan.dentCount === 1 ? '1 Dent' : `${scan.dentCount} Dents`;

                    return (
                      <button
                        key={scan.id}
                        type="button"
                        onClick={() => handleOpenEstimateDetail(scan.primaryDentType)}
                        className="p-4 rounded-2xl bg-[#13131C] border border-white/10 hover:border-[#FF6B35]/50 text-left flex flex-col justify-between gap-4 transition-colors cursor-pointer"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <h3 className="font-display text-base font-semibold text-white truncate">
                              {scan.carName}
                            </h3>
                            <p className="text-xs text-zinc-400 mt-0.5">
                              {scan.year} · {scan.scannedDate}
                            </p>
                          </div>
                          <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center text-zinc-300 shrink-0">
                            <Car className="w-4 h-4" />
                          </div>
                        </div>

                        <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                          <span className="text-xs font-medium text-zinc-300">
                            {dentLabel} · {scan.primaryDentType}
                          </span>
                          <span className="font-mono-num text-base font-bold text-[#FF6B35]">
                            {formattedCost}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </section>

            {/* 320x50 Banner Ad Placeholder at Home Bottom */}
            {showBannerAd()}
          </>
        )}
      </main>

      {/* Dent Pin Details Popup */}
      <DentPinModal
        pin={activePin}
        country={country}
        onClose={() => setActivePin(null)}
        onApplyToEstimate={handleSelectDentType}
      />

      {/* Bottom Navigation: Home, Scan, Estimate, My Cars, Profile */}
      <BottomNav activeTab={activeTab} onSelectTab={handleBottomTabClick} />
    </div>
  );
}
