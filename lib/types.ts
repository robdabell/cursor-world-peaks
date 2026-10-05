import type { Continent } from "@/lib/geo";

export type PeakView = {
  _id: string;
  slug: string;
  name: string;
  localName?: string;
  elevationM: number;
  prominenceM?: number;
  baseToSummitM?: number;
  range: string;
  countries: string[];
  continent: Continent;
  lat: number;
  lng: number;
  firstAscentYear?: number;
  wikipediaTitle?: string;
  funFact: string;
  summary?: string;
  imageUrl?: string;
  thumbUrl?: string;
  imageCredit?: string;
  wikipediaUrl?: string;
};
