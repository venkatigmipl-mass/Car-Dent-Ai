export type CountryCode = 'India' | 'USA' | 'UK' | 'Canada' | 'Australia';

export type DentType =
  | 'Small Dent'
  | 'Medium Dent'
  | 'Deep Scratch'
  | 'Bumper Damage';

export interface CountryOption {
  id: CountryCode;
  name: string;
  flag: string;
  currencySymbol: string;
  currencyCode: string;
}

export interface DentTypeInfo {
  type: DentType;
  repairTime: string;
  description: string;
  severity: string;
}

export interface DentPin {
  id: 'front-door' | 'rear-bumper';
  location: string;
  panel: string;
  dentType: DentType;
  depthMm: string;
  confidence: string;
  notes: string;
  xPercent: number;
  yPercent: number;
}

export interface RecentScan {
  id: string;
  carName: string;
  year: string;
  dentCount: number;
  primaryDentType: DentType;
  dentTypes: DentType[];
  scannedDate: string;
}

export interface GarageOption {
  id: string;
  name: string;
  distanceKm: string;
  rating: string;
  phone: string;
  priceFactor: number;
  specialty: string;
}

export interface CarDentStorageState {
  selectedDentType: DentType;
  recentScans: RecentScan[];
  notificationsEnabled: boolean;
  isPremium: boolean;
  lastUpdatedAt: string;
}

export const STORAGE_COUNTRY_KEY = 'cardent_country';
export const STORAGE_APP_KEY = 'cardent_v1';

export const COUNTRIES: CountryOption[] = [
  {
    id: 'India',
    name: 'India',
    flag: '🇮🇳',
    currencySymbol: '₹',
    currencyCode: 'INR',
  },
  {
    id: 'USA',
    name: 'USA',
    flag: '🇺🇸',
    currencySymbol: '$',
    currencyCode: 'USD',
  },
  {
    id: 'UK',
    name: 'UK',
    flag: '🇬🇧',
    currencySymbol: '£',
    currencyCode: 'GBP',
  },
  {
    id: 'Canada',
    name: 'Canada',
    flag: '🇨🇦',
    currencySymbol: '$',
    currencyCode: 'CAD',
  },
  {
    id: 'Australia',
    name: 'Australia',
    flag: '🇦🇺',
    currencySymbol: '$',
    currencyCode: 'AUD',
  },
];

export const DENT_TYPES: DentTypeInfo[] = [
  {
    type: 'Small Dent',
    repairTime: '1 Day',
    description: 'Minor door ding or hail dimple without paint cracking.',
    severity: 'Minor',
  },
  {
    type: 'Medium Dent',
    repairTime: '2 Days',
    description: 'Creased panel depression requiring pull & surface refinish.',
    severity: 'Moderate',
  },
  {
    type: 'Deep Scratch',
    repairTime: '2 Days',
    description: 'Primer-deep abrasion requiring sanding, filler, and clearcoat.',
    severity: 'Moderate',
  },
  {
    type: 'Bumper Damage',
    repairTime: '3 Days',
    description: 'Structural bumper deformation or corner impact restoration.',
    severity: 'Major',
  },
];

const PRICING_TABLE: Record<DentType, Record<CountryCode, number>> = {
  'Small Dent': {
    India: 500,
    USA: 75,
    UK: 60,
    Canada: 100,
    Australia: 110,
  },
  'Medium Dent': {
    India: 2500,
    USA: 250,
    UK: 200,
    Canada: 340,
    Australia: 380,
  },
  'Deep Scratch': {
    India: 4000,
    USA: 450,
    UK: 350,
    Canada: 600,
    Australia: 650,
  },
  'Bumper Damage': {
    India: 8000,
    USA: 900,
    UK: 700,
    Canada: 1200,
    Australia: 1350,
  },
};

export const HERO_DENT_PINS: DentPin[] = [
  {
    id: 'front-door',
    location: 'Front Door',
    panel: 'Right Front Door Panel',
    dentType: 'Medium Dent',
    depthMm: '4.2 mm crease',
    confidence: '98% match',
    notes: 'Paintless pull & blend recommended near lower character line.',
    xPercent: 56,
    yPercent: 56,
  },
  {
    id: 'rear-bumper',
    location: 'Rear Bumper',
    panel: 'Rear Quarter & Bumper Corner',
    dentType: 'Bumper Damage',
    depthMm: '11.5 mm impact',
    confidence: '96% match',
    notes: 'Polymer heat reshape, bracket alignment, and metallic respray.',
    xPercent: 13,
    yPercent: 57,
  },
];

export const DEFAULT_RECENT_SCANS: RecentScan[] = [
  {
    id: 'scan-1',
    carName: 'Honda Civic',
    year: '2023 Sedan',
    dentCount: 2,
    primaryDentType: 'Medium Dent',
    dentTypes: ['Small Dent', 'Medium Dent'],
    scannedDate: 'Today',
  },
  {
    id: 'scan-2',
    carName: 'Toyota Camry',
    year: '2022 Hybrid',
    dentCount: 1,
    primaryDentType: 'Deep Scratch',
    dentTypes: ['Deep Scratch'],
    scannedDate: '2 days ago',
  },
  {
    id: 'scan-3',
    carName: 'Hyundai Elantra',
    year: '2024 Sport',
    dentCount: 2,
    primaryDentType: 'Bumper Damage',
    dentTypes: ['Small Dent', 'Bumper Damage'],
    scannedDate: '5 days ago',
  },
];

export const NEARBY_GARAGES: GarageOption[] = [
  {
    id: 'city-auto-body',
    name: 'City Auto Body',
    distanceKm: '1.2 km',
    rating: '4.8',
    phone: '+18005550142',
    priceFactor: 1,
    specialty: 'Paintless Dent & Panel Pull',
  },
  {
    id: 'quickfix-dent',
    name: 'QuickFix Dent',
    distanceKm: '2.5 km',
    rating: '4.6',
    phone: '+18005550188',
    priceFactor: 0.92,
    specialty: 'Express Same-Day Dent Repair',
  },
  {
    id: 'premium-auto-care',
    name: 'Premium Auto Care',
    distanceKm: '3.1 km',
    rating: '4.9',
    phone: '+18005550199',
    priceFactor: 1.1,
    specialty: 'OEM Color Match & Ceramic Polish',
  },
];

export function getCountryMeta(country: CountryCode): CountryOption {
  return COUNTRIES.find((c) => c.id === country) ?? COUNTRIES[1];
}

export function getCurrencySymbol(country: CountryCode): string {
  return getCountryMeta(country).currencySymbol;
}

/**
 * Returns the exact repair price for a given dent type and saved country.
 */
export function getPrice(type: DentType, country: CountryCode): number {
  return PRICING_TABLE[type][country];
}

export function formatPrice(amount: number, country: CountryCode): string {
  const symbol = getCurrencySymbol(country);
  return `${symbol}${amount}`;
}

export function getDentTypeInfo(type: DentType): DentTypeInfo {
  return DENT_TYPES.find((item) => item.type === type) ?? DENT_TYPES[0];
}

export function calculateScanTotal(scan: RecentScan, country: CountryCode): number {
  return scan.dentTypes.reduce((sum, dentType) => sum + getPrice(dentType, country), 0);
}

export interface CostBreakdown {
  dentRepair: number;
  painting: number;
  polish: number;
  total: number;
}

export function getCostBreakdown(
  type: DentType,
  country: CountryCode
): CostBreakdown {
  const total = getPrice(type, country);
  const dentRepair = Math.round(total * 0.55);
  const painting = Math.round(total * 0.30);
  const polish = total - dentRepair - painting;

  return {
    dentRepair,
    painting,
    polish,
    total,
  };
}

export function getDentLocationInfo(type: DentType): {
  location: string;
  panel: string;
  xPercent: number;
  yPercent: number;
} {
  if (type === 'Bumper Damage') {
    return {
      location: 'Rear Bumper',
      panel: 'Rear Quarter & Bumper Corner',
      xPercent: 13,
      yPercent: 57,
    };
  }
  if (type === 'Deep Scratch') {
    return {
      location: 'Rear Door',
      panel: 'Right Rear Door Panel',
      xPercent: 40,
      yPercent: 55,
    };
  }
  return {
    location: 'Front Door',
    panel: 'Right Front Door Panel',
    xPercent: 56,
    yPercent: 56,
  };
}

export function getSavedCountry(): CountryCode | null {
  try {
    const raw = localStorage.getItem(STORAGE_COUNTRY_KEY);
    if (
      raw === 'India' ||
      raw === 'USA' ||
      raw === 'UK' ||
      raw === 'Canada' ||
      raw === 'Australia'
    ) {
      return raw;
    }
    return null;
  } catch {
    return null;
  }
}

export function saveCountry(country: CountryCode): void {
  try {
    localStorage.setItem(STORAGE_COUNTRY_KEY, country);
  } catch {
    // Ignore storage quota errors in restricted environments
  }
}

export function loadAppState(): CarDentStorageState {
  const fallback: CarDentStorageState = {
    selectedDentType: 'Medium Dent',
    recentScans: DEFAULT_RECENT_SCANS,
    notificationsEnabled: true,
    isPremium: false,
    lastUpdatedAt: new Date().toISOString(),
  };

  try {
    const raw = localStorage.getItem(STORAGE_APP_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_APP_KEY, JSON.stringify(fallback));
      return fallback;
    }
    const parsed = JSON.parse(raw) as Partial<CarDentStorageState>;
    const validType = DENT_TYPES.some((d) => d.type === parsed.selectedDentType)
      ? (parsed.selectedDentType as DentType)
      : fallback.selectedDentType;

    const validScans = Array.isArray(parsed.recentScans)
      ? parsed.recentScans
      : DEFAULT_RECENT_SCANS;

    return {
      selectedDentType: validType,
      recentScans: validScans,
      notificationsEnabled:
        typeof parsed.notificationsEnabled === 'boolean'
          ? parsed.notificationsEnabled
          : true,
      isPremium:
        typeof parsed.isPremium === 'boolean' ? parsed.isPremium : false,
      lastUpdatedAt: parsed.lastUpdatedAt ?? fallback.lastUpdatedAt,
    };
  } catch {
    return fallback;
  }
}

export function saveAppState(state: CarDentStorageState): void {
  try {
    localStorage.setItem(STORAGE_APP_KEY, JSON.stringify(state));
  } catch {
    // Ignore storage errors
  }
}
