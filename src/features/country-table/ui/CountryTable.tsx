import { flexRender } from "@tanstack/react-table";
import type { Country } from "@entities/country";
import { cn } from "@shared/lib/utils";
import { Button } from "@shared/ui";
import { useCountryTable } from "../model/useCountryTable";

interface CountryTableProps {
  countries: Country[];
  selectedCountryCode: string | null;
  hoveredCountryCode: string | null;
  onSelect: (code: string) => void;
  onHover: (code: string | null) => void;
  className?: string;
}

export function CountryTable({
  countries,
  selectedCountryCode,
  hoveredCountryCode,
  onSelect,
  onHover,
  className,
}: CountryTableProps) {
  const {
    table,
    rows,
    totalCount,
    filteredCount,
    uniqueRegions,
    globalSearch,
    setGlobalSearch,
    getFilterValue,
    setFilterValue,
    handleKeyDown,
    focusedIndex,
    setFocusedIndex,
    columnCount,
    clearAll,
    scrollParentRef,
    rowVirtualizer,
  } = useCountryTable({
    countries,
    selectedCountryCode,
    onSelect,
    onHover,
  });

  const virtualRows = rowVirtualizer.getVirtualItems();
  const totalSize = rowVirtualizer.getTotalSize();
  const paddingTop = virtualRows.length > 0 ? virtualRows[0].start : 0;
  const paddingBottom =
    virtualRows.length > 0 ? totalSize - virtualRows[virtualRows.length - 1].end : 0;

  return (
    <div className={cn("flex w-full min-w-0 flex-col rounded-2xl bg-zinc-900/95", className)}>
      <div className="flex items-center gap-2 border-b border-zinc-800 px-3 py-2">
        <input
          type="search"
          placeholder="Search by name, code or capital..."
          value={globalSearch}
          onChange={(e) => setGlobalSearch(e.target.value)}
          className="flex-1 rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
        />
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={clearAll}
          className="rounded-xl px-3 py-2 text-xs font-medium"
        >
          Clear
        </Button>
      </div>
      <div className="flex items-center justify-between border-b border-zinc-800 px-3 py-1.5 text-xs text-zinc-400">
        <span>
          Showing <span className="text-zinc-100">{filteredCount}</span> of{" "}
          <span className="text-zinc-100">{totalCount}</span> countries
        </span>
        <span className="hidden md:inline text-zinc-500">Use ↑ ↓ + Enter to navigate</span>
      </div>
      <div
        tabIndex={0}
        role="grid"
        aria-label="Countries table"
        aria-rowcount={rows.length}
        className="overflow-auto outline-none focus-visible:ring-2 focus-visible:ring-amber-400/50 focus-visible:ring-inset focus-visible:ring-offset-0 min-h-[200px] max-h-[50vh]"
        onKeyDown={handleKeyDown}
        ref={scrollParentRef}
      >
        <table className="w-full table-fixed border-collapse text-left text-sm text-zinc-100">
          <thead className="sticky top-0 z-10 bg-zinc-900">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className={cn(
                      "border-b border-zinc-700 p-1.5 text-zinc-300",
                      (header.column.id === "population" || header.column.id === "code") &&
                        "text-right",
                    )}
                  >
                    <div className="flex flex-col gap-1">
                      <button
                        type="button"
                        className={cn(
                          "flex items-center gap-1 rounded-md px-1.5 py-1 text-left font-medium text-zinc-100 hover:bg-zinc-800",
                          header.column.getCanSort() && "cursor-pointer",
                        )}
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {{
                          asc: " ↑",
                          desc: " ↓",
                        }[header.column.getIsSorted() as string] ?? null}
                      </button>
                      {header.column.getCanFilter() && (
                        <div className="flex min-w-0">
                          {header.column.id === "region" ? (
                            <select
                              className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-1.5 py-1 text-xs text-zinc-100 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400"
                              value={String(getFilterValue("region"))}
                              onChange={(e) =>
                                setFilterValue("region", e.target.value || undefined)
                              }
                            >
                              <option value="">All</option>
                              {uniqueRegions.map((r) => (
                                <option key={r} value={r}>
                                  {r}
                                </option>
                              ))}
                            </select>
                          ) : header.column.id === "population" ? (
                            <input
                              type="text"
                              placeholder="min,max"
                              className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-1.5 py-1 text-xs text-zinc-100 placeholder-zinc-500 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400"
                              value={String(getFilterValue("population"))}
                              onChange={(e) =>
                                setFilterValue("population", e.target.value || undefined)
                              }
                            />
                          ) : (
                            <input
                              type="text"
                              placeholder="Filter..."
                              className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-1.5 py-1 text-xs text-zinc-100 placeholder-zinc-500 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400"
                              value={String(getFilterValue(header.column.id))}
                              onChange={(e) =>
                                setFilterValue(header.column.id, e.target.value || undefined)
                              }
                            />
                          )}
                        </div>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={columnCount}
                  className="border-b border-zinc-800 p-6 text-center text-zinc-500"
                >
                  No countries match filters.
                </td>
              </tr>
            ) : (
              <>
                {paddingTop > 0 && (
                  <tr>
                    <td colSpan={columnCount} style={{ height: paddingTop }} />
                  </tr>
                )}
                {virtualRows.map((virtualRow) => {
                  const row = rows[virtualRow.index];
                  const index = virtualRow.index;
                  const code = row.original.cca2;
                  const isSelected = selectedCountryCode === code;
                  const isHovered = hoveredCountryCode === code;
                  const isFocused = focusedIndex === index;
                  return (
                    <tr
                      key={row.id}
                      data-index={index}
                      role="row"
                      aria-selected={isSelected}
                      className={cn(
                        "cursor-pointer border-b border-zinc-800 border-l-2 border-l-transparent transition-colors",
                        isSelected && "bg-amber-500/20 text-amber-100 border-l-amber-400",
                        (isHovered || isFocused) && !isSelected && "bg-zinc-800",
                        !isSelected &&
                          !isHovered &&
                          !isFocused &&
                          "text-zinc-200 hover:bg-zinc-900",
                      )}
                      onClick={() => {
                        setFocusedIndex(index);
                        onSelect(code);
                      }}
                      onMouseEnter={() => onHover(code)}
                      onMouseLeave={() => onHover(null)}
                      onFocus={() => setFocusedIndex(index)}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <td
                          key={cell.id}
                          className={cn(
                            "border-r border-zinc-800 px-2 py-1.5 last:border-r-0",
                            (cell.column.id === "population" || cell.column.id === "code") &&
                              "text-right tabular-nums",
                            "overflow-hidden text-ellipsis whitespace-nowrap align-middle",
                          )}
                        >
                          <div className="overflow-hidden text-ellipsis whitespace-nowrap">
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </div>
                        </td>
                      ))}
                    </tr>
                  );
                })}
                {paddingBottom > 0 && (
                  <tr>
                    <td colSpan={columnCount} style={{ height: paddingBottom }} />
                  </tr>
                )}
              </>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
