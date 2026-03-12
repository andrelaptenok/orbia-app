import * as THREE from "three";

export function latLngToVector3(lat: number, lng: number, radius: number): THREE.Vector3 {
  const phi = ((90 - lat) * Math.PI) / 180;
  const theta = ((lng + 180) * Math.PI) / 180;

  const sinPhi = Math.sin(phi);
  const cosPhi = Math.cos(phi);
  const sinTheta = Math.sin(theta);
  const cosTheta = Math.cos(theta);

  const x = -radius * sinPhi * cosTheta;
  const y = radius * cosPhi;
  const z = radius * sinPhi * sinTheta;

  return new THREE.Vector3(x, y, z);
}
