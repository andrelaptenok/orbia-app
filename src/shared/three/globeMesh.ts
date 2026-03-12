import * as THREE from "three";
import earthTextureUrl from "@shared/assets/earth.webp";
import { GLOBE_RADIUS } from "@shared/three/constants.ts";

export function createGlobeMesh(): THREE.Mesh {
  const geometry = new THREE.SphereGeometry(GLOBE_RADIUS, 64, 32);
  const loader = new THREE.TextureLoader();

  const material = new THREE.MeshBasicMaterial({ color: 0x020617 });

  const mesh = new THREE.Mesh(geometry, material);

  loader.load(
    earthTextureUrl,
    (texture) => {
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.ClampToEdgeWrapping;
      const mat = mesh.material as THREE.MeshBasicMaterial;
      mat.map = texture;
      mat.color.set(0xffffff);
      mat.needsUpdate = true;
    },
    undefined,
    (err) => console.warn("Earth texture failed to load:", err),
  );

  return mesh;
}
