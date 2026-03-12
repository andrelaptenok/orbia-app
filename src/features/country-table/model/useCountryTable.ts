import { type KeyboardEvent, useEffect, useMemo, useRef, useState } from "react";
import {
  type ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";
import type { Country } from "@entities/country";
import { useDebouncedValue } from "@shared/lib/useDebouncedValue";
import { countryTableColumns } from "@features/country-table/model/columns.ts";

interface UseCountryTableParams {
  countries: Country[];
  selectedCountryCode: string | null;
  onSelect: (code: string) => void;
  onHover: (code: string | null) => void;
}

export function useCountryTable(props: UseCountryTableParams) {
  const { countries, selectedCountryCode, onSelect, onHover } = props;

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalSearchInput, setGlobalSearchInput] = useState("");
  const globalSearch = useDebouncedValue(globalSearchInput, 220);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const scrollParentRef = useRef<HTMLDivElement | null>(null);

  const columns = useMemo(() => [...countryTableColumns], []);

  const table = useReactTable({
    data: countries,
    columns,
    state: { sorting, columnFilters, globalFilter: globalSearch },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: () => {},
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: (row, _columnId, filterValue: string) => {
      const q = filterValue.trim().toLowerCase();
      if (!q) return true;
      const { name, cca2, cca3, capital } = row.original;
      const fullName = `${name.common} ${name.official}`.toLowerCase();
      const codes = `${cca2} ${cca3}`.toLowerCase();
      const cap = (capital ?? []).join(" ").toLowerCase();
      return fullName.includes(q) || codes.includes(q) || cap.includes(q);
    },
  });

  const rows = table.getRowModel().rows;
  const totalCount = countries.length;
  const filteredCount = rows.length;
  const columnCount = table.getAllColumns().length;

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => scrollParentRef.current,
    estimateSize: () => 40,
    overscan: 10,
  });

  const uniqueRegions = useMemo(
    () => Array.from(new Set(countries.map((c) => c.region))).sort(),
    [countries],
  );

  useEffect(() => {
    const idx = rows.findIndex((r) => r.original.cca2 === selectedCountryCode);
    setFocusedIndex(idx >= 0 ? idx : 0);
  }, [rows, selectedCountryCode]);

  useEffect(() => {
    if (rows.length === 0) return;
    const code = rows[focusedIndex]?.original.cca2 ?? null;
    onHover(code);
  }, [focusedIndex, rows, onHover]);

  const getFilterValue = (columnId: string) =>
    columnFilters.find((f) => f.id === columnId)?.value ?? "";

  const setFilterValue = (columnId: string, value: unknown) => {
    setColumnFilters((prev) => {
      const next = prev.filter((f) => f.id !== columnId);
      if (value !== "" && value != null) {
        next.push({ id: columnId, value });
      }
      return next;
    });
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (rows.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setFocusedIndex((prev) => Math.min(prev + 1, rows.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setFocusedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const row = rows[focusedIndex];
      if (row) onSelect(row.original.cca2);
    }
  };

  const clearAll = () => {
    setGlobalSearchInput("");
    setColumnFilters([]);
    setSorting([]);
  };

  return {
    table,
    rows,
    totalCount,
    filteredCount,
    uniqueRegions,
    globalSearch: globalSearchInput,
    setGlobalSearch: setGlobalSearchInput,
    getFilterValue,
    setFilterValue,
    handleKeyDown,
    focusedIndex,
    setFocusedIndex,
    columnCount,
    clearAll,
    scrollParentRef,
    rowVirtualizer,
  };
}
