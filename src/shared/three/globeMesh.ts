import * as THREE from "three";
import earthTextureUrl from "@shared/assets/earth.jpg";
import { GLOBE_RADIUS } from "@shared/three/constants.ts";

export function createGlobeMesh(): THREE.Mesh {
  const geometry = new THREE.SphereGeometry(GLOBE_RADIUS, 64, 32);
  const loader = new THREE.TextureLoader();

  const material = new THREE.MeshBasicMaterial({ color: 0xffffff });

  const mesh = new THREE.Mesh(geometry, material);

  loader.load(
    earthTextureUrl,
    (texture) => {
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.ClampToEdgeWrapping;
      (mesh.material as THREE.MeshBasicMaterial).map = texture;
      (mesh.material as THREE.MeshBasicMaterial).needsUpdate = true;
    },
    undefined,
    (err) => console.warn("Earth texture failed to load:", err),
  );

  return mesh;
}
