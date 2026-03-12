import { useEffect, useRef } from "react";
import { cn } from "@shared/lib/utils";
import { Button } from "@shared/ui";
import type { Country } from "@entities/country";
import styles from "./CountryDetailPanel.module.css";

interface CountryDetailPanelProps {
  country: Country | null;
  onClose: () => void;
  className?: string;
}

export function CountryDetailPanel({ country, onClose, className }: CountryDetailPanelProps) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (country) closeRef.current?.focus();
  }, [country, country?.cca2]);

  if (!country) return null;

  const languages = country.languages ? Object.values(country.languages).join(", ") : "—";
  const capital = country.capital?.join(", ") ?? "—";

  return (
    <div
      className={cn(
        styles.panelIn,
        "absolute left-1/2 top-2 z-10 w-[92%] max-w-xs max-h-[calc(100%-1rem)] -translate-x-1/2 overflow-y-auto rounded-2xl border border-zinc-700 bg-zinc-900/95 p-3 shadow-2xl backdrop-blur lg:left-3 lg:top-3 lg:w-72 lg:max-w-none lg:p-4 lg:translate-x-0",
        className,
      )}
    >
      <div className="mb-3 flex items-start justify-between gap-2">
        <div>
          <h3 className="text-base font-semibold text-zinc-100 sm:text-lg">
            {country.name.common}
          </h3>
          {country.name.official !== country.name.common && (
            <p className="mt-0.5 text-xs text-zinc-400 sm:text-sm">{country.name.official}</p>
          )}
        </div>
        <Button
          ref={closeRef}
          type="button"
          variant="icon"
          size="icon"
          onClick={onClose}
          className="touch-manipulation p-2 text-xl text-zinc-400 hover:text-zinc-100"
          aria-label="Close"
        >
          ×
        </Button>
      </div>
      {country.flags?.png && (
        <img
          src={country.flags.png}
          alt={country.flags.alt ?? country.name.common}
          className="mb-3 h-10 rounded-lg object-cover shadow-sm ring-1 ring-zinc-700/60 sm:h-12"
        />
      )}
      <dl className="space-y-1.5 text-xs sm:space-y-2 sm:text-sm">
        <Row label="Capital" value={capital} />
        <Row label="Region" value={country.region} />
        {country.subregion && <Row label="Subregion" value={country.subregion} />}
        <Row label="Population" value={country.population.toLocaleString()} />
        {country.area != null && (
          <Row label="Area" value={`${country.area.toLocaleString()} km²`} />
        )}
        <Row label="Languages" value={languages} />
        <Row label="Code" value={`${country.cca2} / ${country.cca3}`} />
      </dl>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2">
      <dt className="shrink-0 text-zinc-400">{label}:</dt>
      <dd className="text-zinc-100">{value}</dd>
    </div>
  );
}
