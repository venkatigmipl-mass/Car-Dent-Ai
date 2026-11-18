import { type CountryCode, type GarageOption } from './pricing';

export const STORAGE_LOCATION_KEY = 'cardent_location';

export interface SavedUserLocation {
  mode: 'gps' | 'city';
  city: string;
  lat: number;
  lng: number;
  updatedAt: string;
}

interface CityCoord {
  city: string;
  country: CountryCode | 'Other';
  lat: number;
  lng: number;
}

const CITY_DIRECTORY: CityCoord[] = [
  // India
  { city: 'Mumbai', country: 'India', lat: 19.076, lng: 72.8777 },
  { city: 'Delhi', country: 'India', lat: 28.6139, lng: 77.209 },
  { city: 'Bengaluru', country: 'India', lat: 12.9716, lng: 77.5946 },
  { city: 'Hyderabad', country: 'India', lat: 17.385, lng: 78.4867 },
  { city: 'Chennai', country: 'India', lat: 13.0827, lng: 80.2707 },
  { city: 'Pune', country: 'India', lat: 18.5204, lng: 73.8567 },
  { city: 'Kolkata', country: 'India', lat: 22.5726, lng: 88.3639 },
  { city: 'Ahmedabad', country: 'India', lat: 23.0225, lng: 72.5714 },
  // USA
  { city: 'New York', country: 'USA', lat: 40.7128, lng: -74.006 },
  { city: 'Los Angeles', country: 'USA', lat: 34.0522, lng: -118.2437 },
  { city: 'San Francisco', country: 'USA', lat: 37.7749, lng: -122.4194 },
  { city: 'Mountain View', country: 'USA', lat: 37.3861, lng: -122.0839 },
  { city: 'San Jose', country: 'USA', lat: 37.3382, lng: -121.8863 },
  { city: 'Chicago', country: 'USA', lat: 41.8781, lng: -87.6298 },
  { city: 'Austin', country: 'USA', lat: 30.2672, lng: -97.7431 },
  { city: 'Houston', country: 'USA', lat: 29.7604, lng: -95.3698 },
  { city: 'Seattle', country: 'USA', lat: 47.6062, lng: -122.3321 },
  { city: 'Miami', country: 'USA', lat: 25.7617, lng: -80.1918 },
  // UK
  { city: 'London', country: 'UK', lat: 51.5072, lng: -0.1276 },
  { city: 'Manchester', country: 'UK', lat: 53.4808, lng: -2.2426 },
  { city: 'Birmingham', country: 'UK', lat: 52.4862, lng: -1.8904 },
  { city: 'Edinburgh', country: 'UK', lat: 55.9533, lng: -3.1883 },
  // Canada
  { city: 'Toronto', country: 'Canada', lat: 43.6532, lng: -79.3832 },
  { city: 'Vancouver', country: 'Canada', lat: 49.2827, lng: -123.1207 },
  { city: 'Montreal', country: 'Canada', lat: 45.5017, lng: -73.5673 },
  { city: 'Calgary', country: 'Canada', lat: 51.0447, lng: -114.0719 },
  // Australia
  { city: 'Sydney', country: 'Australia', lat: -33.8688, lng: 151.2093 },
  { city: 'Melbourne', country: 'Australia', lat: -37.8136, lng: 144.9631 },
  { city: 'Brisbane', country: 'Australia', lat: -27.4698, lng: 153.0251 },
  { city: 'Perth', country: 'Australia', lat: -31.9505, lng: 115.8605 },
  // Global fallback hubs
  { city: 'Tokyo', country: 'Other', lat: 35.6762, lng: 139.6503 },
  { city: 'Singapore', country: 'Other', lat: 1.3521, lng: 103.8198 },
  { city: 'Dubai', country: 'Other', lat: 25.2048, lng: 55.2708 },
];

const GARAGE_OFFSETS: Record<string, { dLat: number; dLng: number }> = {
  'city-auto-body': { dLat: 0.0082, dLng: 0.0068 },
  'quickfix-dent': { dLat: -0.0165, dLng: 0.0155 },
  'premium-auto-care': { dLat: 0.0215, dLng: -0.0185 },
};

/**
 * Great-circle Haversine distance in kilometers between two GPS coordinates.
 */
export function calculateDistanceKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function findNearestKnownCity(lat: number, lng: number): string {
  let closest = CITY_DIRECTORY[0];
  let bestDist = Infinity;

  for (const entry of CITY_DIRECTORY) {
    const d = calculateDistanceKm(lat, lng, entry.lat, entry.lng);
    if (d < bestDist) {
      bestDist = d;
      closest = entry;
    }
  }

  return bestDist <= 180 ? closest.city : `Area (${lat.toFixed(2)}, ${lng.toFixed(2)})`;
}

export function getCoordinatesForCity(
  cityName: string,
  country: CountryCode
): { city: string; lat: number; lng: number } {
  const normalized = cityName.trim().toLowerCase();
  const exact = CITY_DIRECTORY.find(
    (item) => item.city.toLowerCase() === normalized
  );
  if (exact) {
    return { city: exact.city, lat: exact.lat, lng: exact.lng };
  }

  const partial = CITY_DIRECTORY.find((item) =>
    item.city.toLowerCase().includes(normalized)
  );
  if (partial && normalized.length >= 3) {
    return { city: cityName.trim(), lat: partial.lat, lng: partial.lng };
  }

  const countryCenter =
    CITY_DIRECTORY.find((item) => item.country === country) ?? CITY_DIRECTORY[0];

  return {
    city: cityName.trim(),
    lat: countryCenter.lat,
    lng: countryCenter.lng,
  };
}

export async function resolveCityFromCoords(
  lat: number,
  lng: number
): Promise<string> {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), 2000);

  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${encodeURIComponent(
        lat
      )}&lon=${encodeURIComponent(lng)}`,
      {
        signal: controller.signal,
        headers: { Accept: 'application/json' },
      }
    );
    window.clearTimeout(timeoutId);

    if (res.ok) {
      const data = (await res.json()) as {
        address?: {
          city?: string;
          town?: string;
          village?: string;
          suburb?: string;
          county?: string;
          state?: string;
        };
      };
      const resolved =
        data.address?.city ||
        data.address?.town ||
        data.address?.village ||
        data.address?.suburb ||
        data.address?.county ||
        data.address?.state;

      if (resolved) {
        return resolved;
      }
    }
  } catch {
    window.clearTimeout(timeoutId);
  }

  return findNearestKnownCity(lat, lng);
}

export function getSavedUserLocation(): SavedUserLocation | null {
  try {
    const raw = localStorage.getItem(STORAGE_LOCATION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<SavedUserLocation>;
    if (
      typeof parsed.city === 'string' &&
      parsed.city.trim().length > 0 &&
      typeof parsed.lat === 'number' &&
      typeof parsed.lng === 'number' &&
      (parsed.mode === 'gps' || parsed.mode === 'city')
    ) {
      return {
        mode: parsed.mode,
        city: parsed.city,
        lat: parsed.lat,
        lng: parsed.lng,
        updatedAt: parsed.updatedAt ?? new Date().toISOString(),
      };
    }
    return null;
  } catch {
    return null;
  }
}

export function saveUserLocation(location: SavedUserLocation): void {
  try {
    localStorage.setItem(STORAGE_LOCATION_KEY, JSON.stringify(location));
  } catch {
    // Ignore storage quota errors
  }
}

export function getGarageWithRealDistance(
  garage: GarageOption,
  location: SavedUserLocation
): {
  garageLat: number;
  garageLng: number;
  distanceKm: string;
  mapsUrl: string;
} {
  const offset = GARAGE_OFFSETS[garage.id] ?? { dLat: 0.01, dLng: 0.01 };
  const garageLat = location.lat + offset.dLat;
  const garageLng = location.lng + offset.dLng;

  const km = calculateDistanceKm(
    location.lat,
    location.lng,
    garageLat,
    garageLng
  );

  const query =
    location.mode === 'gps'
      ? `car dent repair near me ${garageLat.toFixed(5)},${garageLng.toFixed(5)}`
      : `car dent repair near me ${location.city}`;

  return {
    garageLat,
    garageLng,
    distanceKm: `${km.toFixed(1)} km`,
    mapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      query
    )}`,
  };
}
