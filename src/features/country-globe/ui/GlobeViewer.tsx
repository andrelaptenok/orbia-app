import { useEffect, useRef, useState } from "react";
import { createGlobeScene, type GlobeSceneApi } from "@features/country-globe";
import { useCountries } from "@entities/country";
import { cn } from "@shared/lib/utils";
import { Button } from "@shared/ui";
import styles from "./GlobeViewer.module.css";

interface GlobeViewerProps {
  onCountrySelect?: (code: string) => void;
  onCountryHover?: (code: string | null) => void;
  highlightedCountryCode?: string | null;
  selectedCountryCode?: string | null;
}

export function GlobeViewer(props: GlobeViewerProps) {
  const { onCountrySelect, onCountryHover, highlightedCountryCode, selectedCountryCode } = props;

  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<GlobeSceneApi | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { data: countries } = useCountries();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = createGlobeScene();
    sceneRef.current = scene;

    scene.setOnReady(() => setIsReady(true));
    scene.setOnError((message) => setError(message));
    scene.mount(container);

    return () => {
      sceneRef.current = null;
      scene.setOnReady(null);
      scene.setOnError(null);
      scene.setOnCountrySelect(null);
      scene.setOnCountryHover(null);
      scene.destroy();
      setIsReady(false);
    };
  }, []);

  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    scene.setOnCountrySelect(onCountrySelect ?? null);
    scene.setOnCountryHover(onCountryHover ?? null);

    if (countries?.length) {
      scene.addCountries(countries);
    }
  }, [countries, onCountrySelect, onCountryHover]);

  useEffect(() => {
    sceneRef.current?.setHighlightedCountry(highlightedCountryCode ?? null);
  }, [highlightedCountryCode]);

  useEffect(() => {
    if (selectedCountryCode && countries?.length) {
      sceneRef.current?.rotateToCountry(selectedCountryCode);
    }
  }, [selectedCountryCode, countries]);

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-900 p-4 text-red-400">
        <p>Failed to initialize 3D: {error}</p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      role="application"
      aria-label="3D globe"
      className={cn(
        styles.globeContainer,
        "absolute inset-0 h-full w-full bg-zinc-950 outline-none",
        "touch-none cursor-grab active:cursor-grabbing",
        !isReady && "flex items-center justify-center",
      )}
    >
      {!isReady && <p className="text-zinc-400">Loading…</p>}

      {isReady && (
        <div className="absolute bottom-3 right-3 flex flex-col gap-2">
          <Button
            type="button"
            size="icon"
            variant="icon"
            onClick={() => sceneRef.current?.zoomIn()}
            aria-label="Zoom in"
          >
            +
          </Button>
          <Button
            type="button"
            size="icon"
            variant="icon"
            onClick={() => sceneRef.current?.zoomOut()}
            aria-label="Zoom out"
          >
            −
          </Button>
        </div>
      )}
    </div>
  );
}
