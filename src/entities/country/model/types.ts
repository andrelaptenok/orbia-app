export interface CountryName {
  common: string;
  official: string;
}

export interface Country {
  name: CountryName;
  capital?: string[];
  region: string;
  subregion?: string;
  population: number;
  area?: number;
  languages?: Record<string, string>;
  latlng?: [number, number];
  cca2: string;
  cca3: string;
  flags: { png: string; svg: string; alt?: string };
}
