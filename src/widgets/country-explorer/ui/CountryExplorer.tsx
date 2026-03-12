import { CountryTable } from "@features/country-table";
import { GlobeViewer } from "@features/country-globe";
import { CountryDetailPanel } from "@entities/country";
import { useCountryExplorer } from "@widgets/country-explorer";
import { ExplorerHeader } from "@widgets/country-explorer/ui/ExplorerHeader.tsx";
import { ExplorerErrorPanel } from "@widgets/country-explorer/ui/ExplorerErrorPanel.tsx";
import { ExplorerTableSkeleton } from "@widgets/country-explorer/ui/ExplorerTableSkeleton.tsx";
import layoutStyles from "./CountryExplorerLayout.module.css";

export function CountryExplorer() {
  const {
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
  } = useCountryExplorer();

  const layoutClasses = {
    table: {
      table: layoutStyles.tablePanelTable,
      globe: layoutStyles.globePanelTable,
    },
    balanced: {
      table: layoutStyles.tablePanelBalanced,
      globe: layoutStyles.globePanelBalanced,
    },
    globe: {
      table: layoutStyles.tablePanelGlobe,
      globe: layoutStyles.globePanelGlobe,
    },
  } as const;

  const { table: tablePanelClass, globe: globePanelClass } = layoutClasses[layoutMode];

  return (
    <div className="flex min-h-screen min-h-[100dvh] flex-col items-center justify-start px-3 py-4 pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)] md:px-6">
      <ExplorerHeader layoutMode={layoutMode} setLayoutMode={setLayoutMode} />
      <div className="mt-5 flex w-full max-w-7xl flex-col items-stretch justify-center gap-5 px-1.5 md:mt-8 md:flex-row md:items-center md:gap-6 md:px-0 mx-auto">
        <div
          className={`flex h-[38vh] w-full min-h-0 shrink-0 flex-col overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-900/85 shadow-[0_18px_60px_rgba(15,23,42,0.9)] backdrop-blur-xl md:h-[60vh] md:max-h-none md:min-w-[260px] ${tablePanelClass}`}
        >
          {isError && (
            <ExplorerErrorPanel
              message={error instanceof Error ? error.message : ""}
              onRetry={() => refetch()}
            />
          )}
          {isLoading && !countries && <ExplorerTableSkeleton />}
          {countries && (
            <CountryTable
              countries={countries}
              selectedCountryCode={selectedCountryCode}
              hoveredCountryCode={hoveredCountryCode}
              onSelect={setSelectedCountryCode}
              onHover={setHoveredCountryCode}
              className="!border-0 !shadow-none"
            />
          )}
        </div>
        <div
          className={`relative h-[50vh] min-h-[260px] w-full max-w-3xl flex-1 overflow-hidden rounded-2xl border border-zinc-700/80 bg-zinc-950/90 shadow-[0_20px_80px_rgba(15,23,42,0.95)] backdrop-blur-2xl md:h-[60vh] md:min-h-[280px] ${globePanelClass}`}
        >
          <GlobeViewer
            onCountrySelect={(code: string) => setSelectedCountryCode(code)}
            onCountryHover={(code: string | null) => setHoveredCountryCode(code)}
            highlightedCountryCode={highlightedCode}
            selectedCountryCode={selectedCountryCode}
          />
          <CountryDetailPanel
            country={selectedCountry}
            onClose={() => setSelectedCountryCode(null)}
          />
        </div>
      </div>
    </div>
  );
}
