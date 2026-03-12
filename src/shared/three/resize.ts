import type * as THREE from "three";

export interface ResizeHandle {
  attach: (container: HTMLDivElement) => void;
  detach: () => void;
}

export function createResizeHandle(
  renderer: THREE.WebGLRenderer,
  camera: THREE.PerspectiveCamera,
): ResizeHandle {
  let resizeObserver: ResizeObserver | null = null;

  function onResize(width: number, height: number): void {
    renderer.setSize(width, height, false);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }

  function attach(container: HTMLDivElement): void {
    onResize(container.clientWidth, container.clientHeight);

    resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const { width, height } = entry.contentRect;
      onResize(width, height);
    });
    resizeObserver.observe(container);
  }

  function detach(): void {
    resizeObserver?.disconnect();
    resizeObserver = null;
  }

  return { attach, detach };
}
