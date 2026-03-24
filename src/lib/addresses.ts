import { ENV } from "../config/env";

export interface AddressDetails {
  formattedAddress: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  placeId: string;
  lat: number;
  lng: number;
}

export interface GooglePlaceDetails {
  formatted_address?: string;
  address_components?: Array<{
    long_name: string;
    short_name: string;
    types: string[];
  }>;
  place_id?: string;
  geometry?: {
    location?: {
      lat: () => number;
      lng: () => number;
    };
  };
}

export function normalizeFromPlace(
  details: GooglePlaceDetails,
): AddressDetails {
  const components: Record<string, string> = {};

  // Extract address components
  if (details.address_components) {
    details.address_components.forEach((component) => {
      component.types.forEach((type) => {
        components[type] = component.long_name;
      });
    });
  }

  // Extract coordinates
  const lat = details.geometry?.location?.lat() ?? 0;
  const lng = details.geometry?.location?.lng() ?? 0;

  return {
    formattedAddress: details.formatted_address ?? "",
    street: [components.street_number, components.route]
      .filter(Boolean)
      .join(" "),
    city: components.locality ?? components.sublocality ?? "",
    state: components.administrative_area_level_1 ?? "",
    postalCode: components.postal_code ?? "",
    country: components.country ?? "",
    placeId: details.place_id ?? "",
    lat,
    lng,
  };
}
