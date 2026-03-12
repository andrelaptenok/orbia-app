import type { Country } from "@entities/country";
import { cn } from "@shared/lib/utils";
import { useCountryList } from "@features/country-list/model/useCountryList.ts";

interface CountryListProps {
  countries: Country[];
  selectedCountryCode: string | null;
  hoveredCountryCode: string | null;
  onSelect: (code: string) => void;
  onHover: (code: string | null) => void;
  className?: string;
}

export function CountryList(props: CountryListProps) {
  const { countries, selectedCountryCode, hoveredCountryCode, onSelect, onHover, className } =
    props;
  const { search, setSearch, listRef, filtered, focusedIndex, setFocusedIndex, handleListKeyDown } =
    useCountryList({ countries, selectedCountryCode, onSelect, onHover });

  return (
    <div
      className={cn(
        "flex w-64 shrink-0 flex-col rounded-xl border border-zinc-700 bg-zinc-900/95 shadow-xl",
        className,
      )}
    >
      <input
        type="search"
        placeholder="Search country..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="m-2 rounded-lg border border-zinc-600 bg-zinc-800 px-3 py-2 text-sm text-zinc-200 placeholder-zinc-500 outline-none focus:border-amber-500/50"
      />
      <ul
        ref={listRef}
        tabIndex={0}
        role="listbox"
        aria-label="Countries"
        aria-activedescendant={
          filtered[focusedIndex] ? `country-${filtered[focusedIndex].cca2}` : undefined
        }
        className="flex-1 max-h-[50vh] overflow-y-auto p-2 outline-none focus:ring-0 focus:ring-inset focus:ring-amber-500/30"
        onKeyDown={handleListKeyDown}
      >
        {filtered.length === 0 && (
          <li className="py-4 text-center text-sm text-zinc-500">
            {search.trim() ? "No countries match your search." : "No countries."}
          </li>
        )}
        {filtered.map((country, index) => {
          const code = country.cca2;
          const isSelected = selectedCountryCode === code;
          const isHovered = hoveredCountryCode === code;
          const isFocused = index === focusedIndex;
          return (
            <li key={code} id={`country-${code}`} role="option" aria-selected={isSelected}>
              <button
                type="button"
                data-index={index}
                onClick={() => {
                  setFocusedIndex(index);
                  onSelect(code);
                }}
                onMouseEnter={() => onHover(code)}
                onMouseLeave={() => onHover(null)}
                onFocus={() => setFocusedIndex(index)}
                className={cn(
                  "w-full rounded-lg px-3 py-2 text-left text-sm transition-colors",
                  isSelected && "bg-amber-500/20 text-amber-200",
                  (isHovered || isFocused) && !isSelected && "bg-zinc-700/80 text-zinc-100",
                  !isSelected && !isHovered && !isFocused && "text-zinc-300 hover:bg-zinc-700/50",
                )}
              >
                {country.name.common}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
