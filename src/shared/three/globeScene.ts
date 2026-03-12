import * as THREE from "three";
import type * as THREE_WebGPU from "three/webgpu";
import * as KVY from "@vladkrutenyuk/three-kvy-core";
import type { Country } from "@entities/country";

import { CAMERA_DISTANCE } from "@shared/three/constants.ts";
import { createGlobeMesh } from "@shared/three/globeMesh.ts";
import { createCountryMarkers } from "@shared/three/countryMarkers.ts";
import { createCameraAndControls } from "@shared/three/controls.ts";
import { createLights } from "@shared/three/lights.ts";
import { createResizeHandle } from "@shared/three/resize.ts";

const ROTATE_DURATION = 0.8;
const ROTATION_SAME_DIR_THRESHOLD = 0.998;
const HOVER_THROTTLE_MS = 40;
const HOVER_DEBOUNCE_LEAVE_MS = 140;
const HOVER_DEBOUNCE_ENTER_MS = 80;

type CountryGroup = THREE.Group & { userData: { countryCode: string } };

export interface GlobeSceneApi {
  ctx: KVY.CoreContext;
  mount: (container: HTMLDivElement) => void;
  destroy: () => void;
  zoomIn: () => void;
  zoomOut: () => void;
  setOnReady: (cb: (() => void) | null) => void;
  setOnError: (cb: ((message: string) => void) | null) => void;
  setOnCountrySelect: (cb: ((code: string) => void) | null) => void;
  setOnCountryHover: (cb: ((code: string | null) => void) | null) => void;
  setHighlightedCountry: (code: string | null) => void;
  addCountries: (countries: Country[]) => void;
  rotateToCountry: (code: string) => void;
}

export function createGlobeScene(): GlobeSceneApi {
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setClearColor(0x020617, 1); // match app background, avoid white flash
  const scene = new THREE.Scene();
  const clock = new THREE.Clock();

  const { camera, controls: cameraControls, zoomIn, zoomOut } = createCameraAndControls();

  const ctx = KVY.CoreContext.create({
    renderer: renderer as unknown as THREE_WebGPU.Renderer,
    camera: camera as unknown as THREE_WebGPU.PerspectiveCamera,
    scene: scene as unknown as THREE_WebGPU.Scene,
    clock: clock as unknown as THREE_WebGPU.Clock,
    modules: {},
  });

  const globeGroup = new THREE.Group();
  const globe = createGlobeMesh();
  globeGroup.add(globe);
  ctx.root.add(globeGroup);

  const countryMarkers = createCountryMarkers(globeGroup);
  createLights(ctx.root);

  let rotateAnimProgress = 1;
  const rotateAnimStart = new THREE.Quaternion();
  const rotateAnimEnd = new THREE.Quaternion();

  const resizeHandle = createResizeHandle(renderer, camera);

  const onBeforeRender = (): void => {
    cameraControls.update(ctx.deltaTime);

    if (rotateAnimProgress < 1) {
      rotateAnimProgress = Math.min(1, rotateAnimProgress + ctx.deltaTime / ROTATE_DURATION);
      const t = 1 - Math.pow(1 - rotateAnimProgress, 2);
      globeGroup.quaternion.slerpQuaternions(rotateAnimStart, rotateAnimEnd, t);
    }
  };
  ctx.three.on("renderbefore", onBeforeRender);

  let onReady: (() => void) | null = null;
  let onError: ((message: string) => void) | null = null;
  let onCountrySelect: ((code: string) => void) | null = null;
  let onCountryHover: ((code: string | null) => void) | null = null;

  function setOnReady(cb: (() => void) | null): void {
    onReady = cb;
  }

  function setOnError(cb: ((message: string) => void) | null): void {
    onError = cb;
  }

  function setOnCountrySelect(cb: ((code: string) => void) | null): void {
    onCountrySelect = cb;
  }

  function setOnCountryHover(cb: ((code: string | null) => void) | null): void {
    onCountryHover = cb;
  }

  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  function getCountryUnderPointer(clientX: number, clientY: number): string | null {
    if (!mountedContainer) return null;

    const rect = mountedContainer.getBoundingClientRect();
    mouse.x = ((clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);

    const hits = raycaster.intersectObjects(countryMarkers.getMeshes());
    const group = hits[0]?.object?.parent as CountryGroup | undefined;
    const code = group?.userData?.countryCode;
    return typeof code === "string" ? code : null;
  }

  let currentHoverCode: string | null = null;
  let lastHoverCheck = 0;
  let lastHoverChange = 0;

  function onPointerMove(event: MouseEvent): void {
    if (!onCountryHover || event.buttons !== 0) return;

    const now = performance.now();
    if (now - lastHoverCheck < HOVER_THROTTLE_MS) return;
    lastHoverCheck = now;

    const code = getCountryUnderPointer(event.clientX, event.clientY);
    if (code === currentHoverCode) return;

    const sinceChange = now - lastHoverChange;
    if (code === null && sinceChange < HOVER_DEBOUNCE_LEAVE_MS) return;
    if (code !== null && currentHoverCode !== null && sinceChange < HOVER_DEBOUNCE_ENTER_MS) return;

    currentHoverCode = code;
    lastHoverChange = now;
    onCountryHover(code);
  }

  function onPointerClick(event: MouseEvent): void {
    if (!onCountrySelect) return;
    const code = getCountryUnderPointer(event.clientX, event.clientY);
    if (typeof code === "string") onCountrySelect(code);
  }

  let mountedContainer: HTMLDivElement | null = null;

  const wheelHandler = (e: WheelEvent): void => {
    e.preventDefault();
  };

  function mount(container: HTMLDivElement): void {
    if (mountedContainer) return;

    mountedContainer = container;

    try {
      ctx.three.mount(container);
    } catch (err) {
      onError?.(err instanceof Error ? err.message : String(err));
      return;
    }

    const canvas = renderer.domElement;
    Object.assign(canvas.style, {
      position: "absolute",
      inset: "0",
      width: "100%",
      height: "100%",
      display: "block",
      pointerEvents: "auto",
      touchAction: "none",
      cursor: "grab",
    });

    resizeHandle.attach(container);
    cameraControls.connect(canvas);
    cameraControls.setLookAt(0, 0, CAMERA_DISTANCE, 0, 0, 0, false);

    container.addEventListener("wheel", wheelHandler, { passive: false, capture: true });
    container.addEventListener("click", onPointerClick);
    container.addEventListener("mousemove", onPointerMove);

    ctx.run();
    container.focus();

    onReady?.();
  }

  function destroy(): void {
    if (mountedContainer) {
      mountedContainer.removeEventListener("wheel", wheelHandler, true);
      mountedContainer.removeEventListener("click", onPointerClick);
      mountedContainer.removeEventListener("mousemove", onPointerMove);
      mountedContainer = null;
    }

    resizeHandle.detach();
    ctx.three.off("renderbefore", onBeforeRender);
    cameraControls.disconnect();
    ctx.destroy();

    scene.traverse((obj) => {
      if (obj instanceof THREE.Mesh) {
        obj.geometry?.dispose();
        if (Array.isArray(obj.material)) {
          obj.material.forEach((m) => m.dispose());
        } else {
          obj.material?.dispose();
        }
      }
    });
    renderer.dispose();
  }

  function rotateToCountry(code: string): void {
    const markerGroup = countryMarkers.group.children.find(
      (c) => (c as CountryGroup).userData?.countryCode === code,
    ) as CountryGroup | undefined;

    if (!markerGroup) return;

    const markerDirWorld = markerGroup.position
      .clone()
      .normalize()
      .applyQuaternion(globeGroup.quaternion);

    const cameraDir = camera.position.clone().normalize();

    if (markerDirWorld.dot(cameraDir) > ROTATION_SAME_DIR_THRESHOLD) return;

    const deltaQuat = new THREE.Quaternion().setFromUnitVectors(markerDirWorld, cameraDir);
    rotateAnimStart.copy(globeGroup.quaternion);
    rotateAnimEnd.copy(deltaQuat).multiply(globeGroup.quaternion);
    rotateAnimProgress = 0;
  }

  const setHighlightedCountry = (code: string | null): void => {
    countryMarkers.setHighlighted(code);
  };

  return {
    ctx,
    mount,
    destroy,
    zoomIn,
    zoomOut,
    setOnReady,
    setOnError,
    setOnCountrySelect,
    setOnCountryHover,
    setHighlightedCountry,
    addCountries: countryMarkers.addCountries,
    rotateToCountry,
  };
}
