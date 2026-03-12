import { type KeyboardEvent, useEffect, useMemo, useRef, useState } from "react";
import { useDebouncedValue } from "@shared/lib/useDebouncedValue";
import type { Country } from "@entities/country";

interface UseCountryListParams {
  countries: Country[];
  selectedCountryCode: string | null;
  onSelect: (code: string) => void;
  onHover: (code: string | null) => void;
}

export function useCountryList({
  countries,
  selectedCountryCode,
  onSelect,
  onHover,
}: UseCountryListParams) {
  const [searchInput, setSearchInput] = useState("");
  const search = useDebouncedValue(searchInput, 220);
  const [cursorIndex, setCursorIndex] = useState(0);
  const listRef = useRef<HTMLUListElement>(null);

  const filtered = useMemo(() => {
    if (!search.trim()) return countries;
    const q = search.trim().toLowerCase();
    return countries.filter(
      (c) =>
        c.name.common.toLowerCase().includes(q) ||
        c.name.official.toLowerCase().includes(q) ||
        c.cca2.toLowerCase().includes(q) ||
        c.cca3.toLowerCase().includes(q),
    );
  }, [countries, search]);

  const focusedIndex = useMemo(() => {
    if (filtered.length === 0) return 0;

    if (selectedCountryCode) {
      const idx = filtered.findIndex((c) => c.cca2 === selectedCountryCode);
      return idx >= 0 ? idx : 0;
    }

    return Math.min(cursorIndex, filtered.length - 1);
  }, [filtered, selectedCountryCode, cursorIndex]);

  useEffect(() => {
    if (filtered.length === 0) return;
    const code = filtered[focusedIndex]?.cca2 ?? null;
    onHover(code);
  }, [focusedIndex, filtered, onHover]);

  useEffect(() => {
    const el = listRef.current?.querySelector(`[data-index="${focusedIndex}"]`);
    (el as HTMLElement)?.scrollIntoView({ block: "nearest" });
  }, [focusedIndex]);

  const handleListKeyDown = (e: KeyboardEvent) => {
    if (filtered.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setCursorIndex((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setCursorIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const country = filtered[focusedIndex];
      if (country) onSelect(country.cca2);
    }
  };

  return {
    search: searchInput,
    setSearch: setSearchInput,
    listRef,
    filtered,
    focusedIndex,
    setFocusedIndex: setCursorIndex,
    handleListKeyDown,
  };
}
