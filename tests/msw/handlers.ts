import { http, HttpResponse } from "msw";
import pvwatts from "../fixtures/pvwatts.sample.json";
import eia from "../fixtures/eia.sample.json";

// Match actual API endpoints
const NREL_URL = "https://developer.nrel.gov/api/pvwatts/v8.json";
const EIA_URL_PATTERN = /api\.eia\.gov.*electricity.*retail/;
const GEOCODE_URL_PATTERN = /maps\.googleapis\.com.*place/;

export const handlers = [
  // PVWatts v8 API
  http.get(NREL_URL, () => {
    return HttpResponse.json(
      {
        version: pvwatts.version,
        station_info: pvwatts.station_info,
        outputs: {
          ac_annual: pvwatts.outputs.ac_annual,
          ac_monthly: pvwatts.outputs.ac_monthly,
          solrad_annual: pvwatts.outputs.solrad_annual,
          solrad_monthly: pvwatts.outputs.solrad_monthly,
          capacity_factor: pvwatts.outputs.capacity_factor,
        },
        inputs: pvwatts.inputs,
      },
      { status: 200 }
    );
  }),

  // EIA electricity rates API
  http.get(EIA_URL_PATTERN, () => {
    return HttpResponse.json(
      {
        response: {
          data: [
            {
              stateid: eia.state,
              sectorid: eia.sector,
              price: eia.rate_dollars_per_kwh,
              period: "2025-08",
            },
          ],
        },
      },
      { status: 200 }
    );
  }),

  // Google Maps Geocoding / Places API
  http.get(GEOCODE_URL_PATTERN, () => {
    return HttpResponse.json(
      {
        result: {
          geometry: {
            location: {
              lat: 37.422,
              lng: -122.084,
            },
          },
          formatted_address: "1600 Amphitheatre Parkway, Mountain View, CA 94043, USA",
          address_components: [
            {
              long_name: "California",
              short_name: "CA",
              types: ["administrative_area_level_1", "political"],
            },
          ],
        },
        status: "OK",
      },
      { status: 200 }
    );
  }),
];

// Error handlers for testing failure cases
export const errorHandlers = {
  pvwattsError: http.get(NREL_URL, () => {
    return HttpResponse.json(
      { errors: ["System capacity must be between 0.5 and 1000 kW"] },
      { status: 400 }
    );
  }),

  eiaError: http.get(EIA_URL_PATTERN, () => {
    return HttpResponse.json({ error: "Service unavailable" }, { status: 500 });
  }),

  geocodeError: http.get(GEOCODE_URL_PATTERN, () => {
    return HttpResponse.json(
      { status: "ZERO_RESULTS", results: [] },
      { status: 200 }
    );
  }),
};

