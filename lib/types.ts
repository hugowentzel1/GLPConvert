// lib/types.ts
export interface PlaceResult {
  formattedAddress: string;
  lat: number;
  lng: number;
  components: Record<string, string>;
  placeId: string;
}
