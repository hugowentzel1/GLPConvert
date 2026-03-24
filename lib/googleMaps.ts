import { Loader } from "@googlemaps/js-api-loader";

export interface PlaceResult {
  formattedAddress: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  lat: number;
  lng: number;
}

let loader: Loader | null = null;
let isLoaded = false;

export async function initializeGoogleMaps(): Promise<void> {
  if (isLoaded) return;

  if (!loader) {
    loader = new Loader({
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
      version: "weekly",
      libraries: ["places"],
    });
  }

  try {
    await loader.load();
    isLoaded = true;
  } catch (error) {
    console.error("Failed to load Google Maps API:", error);
    throw error;
  }
}

export function createAutocompleteSessionToken(): google.maps.places.AutocompleteSessionToken {
  if (!isLoaded) {
    throw new Error("Google Maps API not loaded");
  }
  return new google.maps.places.AutocompleteSessionToken();
}

export async function getPlacePredictions(
  input: string,
  sessionToken: google.maps.places.AutocompleteSessionToken,
): Promise<google.maps.places.AutocompletePrediction[]> {
  if (!isLoaded) {
    throw new Error("Google Maps API not loaded");
  }

  const service = new google.maps.places.AutocompleteService();

  return new Promise((resolve, reject) => {
    service.getPlacePredictions(
      {
        input,
        sessionToken,
        componentRestrictions: { country: "us" }, // Restrict to US
        types: ["address"],
      },
      (predictions, status) => {
        if (
          status === google.maps.places.PlacesServiceStatus.OK &&
          predictions
        ) {
          resolve(predictions);
        } else {
          reject(new Error(`Places API error: ${status}`));
        }
      },
    );
  });
}

export async function getPlaceDetails(
  placeId: string,
  sessionToken: google.maps.places.AutocompleteSessionToken,
): Promise<PlaceResult> {
  if (!isLoaded) {
    throw new Error("Google Maps API not loaded");
  }

  const service = new google.maps.places.PlacesService(
    document.createElement("div"),
  );

  return new Promise((resolve, reject) => {
    service.getDetails(
      {
        placeId,
        fields: ["address_components", "formatted_address", "geometry"],
      },
      (place, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && place) {
          const result = parsePlaceDetails(place);
          resolve(result);
        } else {
          reject(new Error(`Place details error: ${status}`));
        }
      },
    );
  });
}

export async function geocodeAddress(address: string): Promise<PlaceResult> {
  if (!isLoaded) {
    throw new Error("Google Maps API not loaded");
  }

  const geocoder = new google.maps.Geocoder();

  return new Promise((resolve, reject) => {
    geocoder.geocode({ address }, (results, status) => {
      if (status === google.maps.GeocoderStatus.OK && results && results[0]) {
        const result = parseGeocodeResult(results[0]);
        resolve(result);
      } else {
        reject(new Error(`Geocoding error: ${status}`));
      }
    });
  });
}

function parsePlaceDetails(place: google.maps.places.PlaceResult): PlaceResult {
  const addressComponents = place.address_components || [];

  return {
    formattedAddress: place.formatted_address || "",
    street: extractAddressComponent(addressComponents, [
      "street_number",
      "route",
    ]),
    city: extractAddressComponent(addressComponents, ["locality"]),
    state: extractAddressComponent(addressComponents, [
      "administrative_area_level_1",
    ]),
    postalCode: extractAddressComponent(addressComponents, ["postal_code"]),
    country: extractAddressComponent(addressComponents, ["country"]),
    lat: place.geometry?.location?.lat() || 0,
    lng: place.geometry?.location?.lng() || 0,
  };
}

function parseGeocodeResult(result: google.maps.GeocoderResult): PlaceResult {
  const addressComponents = result.address_components || [];

  return {
    formattedAddress: result.formatted_address || "",
    street: extractAddressComponent(addressComponents, [
      "street_number",
      "route",
    ]),
    city: extractAddressComponent(addressComponents, ["locality"]),
    state: extractAddressComponent(addressComponents, [
      "administrative_area_level_1",
    ]),
    postalCode: extractAddressComponent(addressComponents, ["postal_code"]),
    country: extractAddressComponent(addressComponents, ["country"]),
    lat: result.geometry?.location?.lat() || 0,
    lng: result.geometry?.location?.lng() || 0,
  };
}

function extractAddressComponent(
  components: google.maps.GeocoderAddressComponent[],
  types: string[],
): string {
  for (const component of components) {
    if (component.types.some((type) => types.includes(type))) {
      return component.long_name;
    }
  }
  return "";
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}
