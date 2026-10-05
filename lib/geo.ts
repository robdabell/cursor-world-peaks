export const CONTINENTS = [
  "Africa",
  "Antarctica",
  "Asia",
  "Europe",
  "North America",
  "Oceania",
  "South America",
] as const;

export type Continent = (typeof CONTINENTS)[number];

export const BEN_NEVIS_M = 1345;
export const EIFFEL_M = 330;

export function formatMetres(value: number) {
  return `${new Intl.NumberFormat("en-GB").format(value)} m`;
}

export function formatLatLng(lat: number, lng: number) {
  const ns = lat >= 0 ? "N" : "S";
  const ew = lng >= 0 ? "E" : "W";
  return `${Math.abs(lat).toFixed(2)}° ${ns}  ${Math.abs(lng).toFixed(2)}° ${ew}`;
}

export function projectEquirectangular(lat: number, lng: number) {
  return {
    x: (lng + 180) / 360,
    y: (90 - lat) / 180,
  };
}

export function timesBenNevis(elevationM: number) {
  return elevationM / BEN_NEVIS_M;
}

export function timesEiffel(elevationM: number) {
  return elevationM / EIFFEL_M;
}
