import { useQuery } from "@tanstack/react-query";
import { fetchCountries } from "@entities/country";

export function useCountries() {
  return useQuery({
    queryKey: ["countries"],
    queryFn: fetchCountries,
    staleTime: 1000 * 60 * 10,
  });
}
