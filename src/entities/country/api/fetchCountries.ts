import { apiGet } from "@shared/api";
import type { Country } from "@entities/country";

const API_BASE = "https://restcountries.com/v3.1";

const FIELDS = [
  "name",
  "capital",
  "region",
  "subregion",
  "population",
  "languages",
  "latlng",
  "cca2",
  "cca3",
  "flags",
] as const;

export async function fetchCountries(): Promise<Country[]> {
  const url = `${API_BASE}/all?fields=${FIELDS.join(",")}`;
  return apiGet<Country[]>(url);
}
