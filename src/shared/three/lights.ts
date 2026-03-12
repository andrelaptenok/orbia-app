import * as THREE from "three";

export function createLights(root: THREE.Object3D): void {
  const ambient = new THREE.AmbientLight(0xffffff, 0.4);
  root.add(ambient);

  const sun = new THREE.DirectionalLight(0xffffff, 0.9);
  sun.position.set(5, 3, 5);
  root.add(sun);

  const fill = new THREE.DirectionalLight(0x88ccff, 0.3);
  fill.position.set(-3, -2, 2);
  root.add(fill);
}
