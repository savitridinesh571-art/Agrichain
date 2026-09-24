/// <reference types="@types/google.maps" />

/**
 * Location Utilities for AgriChain
 * Handles Haversine distance calculation, HTML5 Geolocation API,
 * reverse geocoding, and default regional coordinates mapping.
 */

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface CustomerLocation extends Coordinates {
  address: string;
  isDetected: boolean;
  detectedAt?: string;
}

// Default regional coordinates mapping for Maharashtra cities/districts
export const DEFAULT_MAHARASHTRA_COORDS: Record<string, Coordinates> = {
  "Mira-Bhayandar, Maharashtra": { latitude: 19.2952, longitude: 72.8544 },
  "Mira-Bhayandar": { latitude: 19.2952, longitude: 72.8544 },
  "Nashik, Maharashtra": { latitude: 20.0059, longitude: 73.7898 },
  "Nashik": { latitude: 20.0059, longitude: 73.7898 },
  "Pune, Maharashtra": { latitude: 18.5204, longitude: 73.8567 },
  "Pune": { latitude: 18.5204, longitude: 73.8567 },
  "Ratnagiri, Maharashtra": { latitude: 16.9902, longitude: 73.3120 },
  "Ratnagiri": { latitude: 16.9902, longitude: 73.3120 },
  "Satara, Maharashtra": { latitude: 17.6805, longitude: 74.0183 },
  "Satara": { latitude: 17.6805, longitude: 74.0183 },
  "Solapur, MH": { latitude: 17.6599, longitude: 75.9064 },
  "Solapur": { latitude: 17.6599, longitude: 75.9064 },
  "Kolhapur, MH": { latitude: 16.7050, longitude: 74.2433 },
  "Kolhapur": { latitude: 16.7050, longitude: 74.2433 },
  "Mahabaleshwar, MH": { latitude: 17.9237, longitude: 73.6586 },
  "Mahabaleshwar": { latitude: 17.9237, longitude: 73.6586 },
  "Nagpur, MH": { latitude: 21.1458, longitude: 79.0882 },
  "Nagpur": { latitude: 21.1458, longitude: 79.0882 },
  "Shimla, HP": { latitude: 31.1048, longitude: 77.1734 }
};

// Fallback center coordinate (Mira-Bhayandar / Thane district)
export const DEFAULT_CUSTOMER_COORDS: Coordinates = {
  latitude: 19.2952,
  longitude: 72.8544
};

/**
 * Calculates distance in kilometers between two coordinates using the Haversine formula.
 */
export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  if (lat1 === lat2 && lon1 === lon2) return 0;

  const R = 6371; // Radius of Earth in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return Math.round(distance * 10) / 10; // Round to 1 decimal place
}

/**
 * Formats distance in km for UI display.
 */
export function formatDistance(distKm: number): string {
  if (distKm < 1) {
    const meters = Math.round(distKm * 1000);
    return `${meters} m`;
  }
  return `${distKm.toFixed(1)} km`;
}

/**
 * Derives latitude and longitude for a given location string if explicit coords are missing.
 */
export function getCoordinatesForLocation(locationName?: string): Coordinates {
  if (!locationName) return DEFAULT_CUSTOMER_COORDS;

  for (const [key, coords] of Object.entries(DEFAULT_MAHARASHTRA_COORDS)) {
    if (locationName.toLowerCase().includes(key.toLowerCase()) || key.toLowerCase().includes(locationName.toLowerCase())) {
      return coords;
    }
  }

  return DEFAULT_CUSTOMER_COORDS;
}

/**
 * Gets the current coordinates from the browser using HTML5 Geolocation API.
 * Handles permissions, timeouts, and unavailable location errors cleanly.
 */
export function getCurrentCoordinates(): Promise<Coordinates> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by your browser. Please enter your location manually."));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
      },
      (error) => {
        let errorMsg = "Unable to retrieve your location.";
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMsg = "Location permission denied. Please allow location access in your browser or enter address manually.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMsg = "Location information is currently unavailable. Please enter address manually.";
            break;
          case error.TIMEOUT:
            errorMsg = "Location request timed out. Please try again or enter address manually.";
            break;
        }
        reject(new Error(errorMsg));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  });
}

/**
 * Performs reverse geocoding via OpenStreetMap Nominatim or Google Maps API fallback.
 */
export async function reverseGeocode(lat: number, lng: number): Promise<string> {
  // If Google Maps API is loaded, attempt using google.maps.Geocoder
  if (typeof google !== "undefined" && google.maps && google.maps.Geocoder) {
    try {
      const geocoder = new google.maps.Geocoder();
      const response = await geocoder.geocode({ location: { lat, lng } });
      if (response.results && response.results[0]) {
        return response.results[0].formatted_address;
      }
    } catch (e) {
      console.warn("Google Maps reverse geocoding fallback to OSM:", e);
    }
  }

  // Fallback to free OpenStreetMap Nominatim reverse geocoding
  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=14`, {
      headers: { "User-Agent": "AgriChain-Web/1.0" }
    });
    if (res.ok) {
      const data = await res.json();
      if (data.display_name) {
        // Return shortened display name (e.g. city/suburb + district)
        const parts = data.display_name.split(",");
        if (parts.length >= 3) {
          return `${parts[0].trim()}, ${parts[1].trim()}, ${parts[2].trim()}`;
        }
        return data.display_name;
      }
    }
  } catch (e) {
    console.warn("OSM Nominatim reverse geocoding error:", e);
  }

  // Final fallback readable string
  return `Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`;
}
