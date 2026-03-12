import { useCallback, useEffect, useState } from "react";
import { useCountries } from "@entities/country";
import { readCountryFromUrl, syncCountryToUrl } from "@widgets/country-explorer/model/urlState.ts";
import {
  type LayoutMode,
  layoutModeToRatio,
  ratioToLayoutMode,
} from "@widgets/country-explorer/model/layoutMode.ts";

export function useCountryExplorer() {
  const [selectedCountryCode, setSelectedCountryCodeState] = useState<string | null>(
    readCountryFromUrl,
  );
  const [hoveredCountryCode, setHoveredCountryCode] = useState<string | null>(null);
  const [splitRatio, setSplitRatio] = useState(0.4);

  const { data: countries, isLoading, isError, error, refetch } = useCountries();
  const selectedCountry = countries?.find((c) => c.cca2 === selectedCountryCode) ?? null;
  const highlightedCode = hoveredCountryCode ?? selectedCountryCode;

  const setSelectedCountryCode = useCallback((code: string | null) => {
    setSelectedCountryCodeState(code);
    syncCountryToUrl(code);
  }, []);

  const layoutMode = ratioToLayoutMode(splitRatio);

  const setLayoutMode = useCallback((mode: LayoutMode) => {
    setSplitRatio(layoutModeToRatio(mode));
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedCountryCode(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [setSelectedCountryCode]);

  useEffect(() => {
    document.title = selectedCountry ? `${selectedCountry.name.common} | Orbia` : "Orbia";
  }, [selectedCountry, selectedCountry?.cca2, selectedCountry?.name.common]);

  return {
    countries,
    isLoading,
    isError,
    error,
    refetch,
    selectedCountry,
    highlightedCode,

    selectedCountryCode,
    setSelectedCountryCode,
    hoveredCountryCode,
    setHoveredCountryCode,

    layoutMode,
    setLayoutMode,
  };
}
