export type LayoutMode = "table" | "balanced" | "globe";

export function layoutModeToRatio(mode: LayoutMode): number {
  switch (mode) {
    case "table":
      return 0.6;
    case "globe":
      return 0.3;
    default:
      return 0.4;
  }
}

export function ratioToLayoutMode(ratio: number): LayoutMode {
  if (ratio >= 0.55) return "table";
  if (ratio <= 0.35) return "globe";
  return "balanced";
}
