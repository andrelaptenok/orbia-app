import { createColumnHelper } from "@tanstack/react-table";
import type { Country } from "@entities/country";

const columnHelper = createColumnHelper<Country>();

export const countryTableColumns = [
  columnHelper.accessor((row) => row.name.common, {
    id: "name",
    header: "Name",
    cell: (info) => info.getValue(),
    filterFn: "includesString",
  }),
  columnHelper.accessor((row) => row.capital?.join(", ") ?? "", {
    id: "capital",
    header: "Capital",
    cell: (info) => info.getValue() || "—",
    filterFn: "includesString",
  }),
  columnHelper.accessor((row) => row.region, {
    id: "region",
    header: "Region",
    cell: (info) => info.getValue(),
    filterFn: (row, _columnId, value: string) => !value || row.getValue("region") === value,
  }),
  columnHelper.accessor((row) => row.population, {
    id: "population",
    header: "Population",
    cell: (info) => info.getValue().toLocaleString(),
    filterFn: (row, _columnId, value: string) => {
      if (!value) return true;
      const [min, max] = value.split(",").map(Number);
      const p = row.getValue("population") as number;
      if (min != null && !Number.isNaN(min) && p < min) return false;
      return !(max != null && !Number.isNaN(max) && p > max);
    },
  }),
  columnHelper.accessor((row) => row.cca2, {
    id: "code",
    header: "Code",
    cell: (info) => `${info.row.original.cca2} / ${info.row.original.cca3}`,
    filterFn: "includesString",
  }),
] as const;
