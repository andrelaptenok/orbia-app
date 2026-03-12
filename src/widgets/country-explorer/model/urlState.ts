export function readCountryFromUrl(): string | null {
  const code = new URLSearchParams(window.location.search).get("country");
  return code && /^[a-zA-Z]{2}$/.test(code) ? code.toUpperCase() : null;
}

export function syncCountryToUrl(code: string | null): void {
  const url = new URL(window.location.href);
  if (code) url.searchParams.set("country", code);
  else url.searchParams.delete("country");
  window.history.replaceState(null, "", url.toString());
}
