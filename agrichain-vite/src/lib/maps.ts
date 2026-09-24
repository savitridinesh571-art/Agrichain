/**
 * Google Maps Loader & Directions Utilities for AgriChain
 * Handles dynamic injection of Google Maps JS API script using environment variables
 * and provides route calculation helpers.
 */

let mapsScriptPromise: Promise<typeof google.maps> | null = null;

export interface MapRouteResult {
  distanceText: string;
  distanceKm: number;
  durationText: string;
  steps?: string[];
  directionsResult?: google.maps.DirectionsResult;
}

/**
 * Dynamically loads the Google Maps JavaScript API script.
 * Uses VITE_GOOGLE_MAPS_API_KEY from environment variables.
 */
export function loadGoogleMapsScript(): Promise<typeof google.maps> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Window is not available"));
  }

  if (typeof google !== "undefined" && google.maps) {
    return Promise.resolve(google.maps);
  }

  if (mapsScriptPromise) {
    return mapsScriptPromise;
  }

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  if (!apiKey || apiKey === "YOUR_KEY" || apiKey.trim() === "") {
    return Promise.reject(
      new Error("VITE_GOOGLE_MAPS_API_KEY is not configured in .env file.")
    );
  }

  mapsScriptPromise = new Promise((resolve, reject) => {
    // Check if script element already exists
    const existingScript = document.getElementById("google-maps-js-script");
    if (existingScript) {
      existingScript.addEventListener("load", () => {
        if (typeof google !== "undefined" && google.maps) {
          resolve(google.maps);
        } else {
          reject(new Error("Google Maps failed to load"));
        }
      });
      existingScript.addEventListener("error", () => reject(new Error("Failed to load Google Maps script")));
      return;
    }

    const script = document.createElement("script");
    script.id = "google-maps-js-script";
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,geometry`;
    script.async = true;
    script.defer = true;

    script.onload = () => {
      if (typeof google !== "undefined" && google.maps) {
        resolve(google.maps);
      } else {
        reject(new Error("Google Maps API object not found after script load."));
      }
    };

    script.onerror = () => {
      mapsScriptPromise = null;
      reject(new Error("Network error loading Google Maps JavaScript API script."));
    };

    document.head.appendChild(script);
  });

  return mapsScriptPromise;
}

/**
 * Calculates delivery route between origin (farmer) and destination (customer).
 */
export async function calculateDirectionsRoute(
  origin: { lat: number; lng: number },
  destination: { lat: number; lng: number }
): Promise<MapRouteResult> {
  const maps = await loadGoogleMapsScript();

  return new Promise((resolve, reject) => {
    const directionsService = new maps.DirectionsService();

    directionsService.route(
      {
        origin: new maps.LatLng(origin.lat, origin.lng),
        destination: new maps.LatLng(destination.lat, destination.lng),
        travelMode: maps.TravelMode.DRIVING
      },
      (result, status) => {
        if (status === maps.DirectionsStatus.OK && result && result.routes[0] && result.routes[0].legs[0]) {
          const leg = result.routes[0].legs[0];
          const distKm = (leg.distance?.value || 0) / 1000;
          resolve({
            distanceText: leg.distance?.text || `${distKm.toFixed(1)} km`,
            distanceKm: distKm,
            durationText: leg.duration?.text || "25 mins",
            steps: leg.steps.map((s) => s.instructions.replace(/<[^>]*>?/gm, "")),
            directionsResult: result
          });
        } else {
          reject(new Error(`Directions request failed with status: ${status}`));
        }
      }
    );
  });
}
