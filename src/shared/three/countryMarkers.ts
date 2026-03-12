import * as THREE from "three";
import type { Country } from "@entities/country";
import {
  GLOBE_RADIUS,
  HIGHLIGHT_COLOR,
  HIGHLIGHT_EMISSIVE,
  HIGHLIGHT_SCALE,
  MARKER_GLOW_RADIUS,
  MARKER_RADIUS,
  MARKER_SEGMENTS,
  NORMAL_COLOR,
  NORMAL_EMISSIVE,
} from "./constants";
import { latLngToVector3 } from "@shared/three/geo.ts";

export interface CountryMarkersApi {
  group: THREE.Group;
  setHighlighted: (code: string | null) => void;
  addCountries: (countries: Country[]) => void;
  getMeshes: () => THREE.Mesh[];
}

export function createCountryMarkers(root: THREE.Object3D): CountryMarkersApi {
  const group = new THREE.Group();
  root.add(group);

  const setHighlighted = (code: string | null): void => {
    group.children.forEach((child) => {
      if (!(child instanceof THREE.Group)) return;
      const markerGroup = child as THREE.Group & { userData: { countryCode: string } };
      const isHighlight = markerGroup.userData?.countryCode === code;
      const scale = isHighlight ? HIGHLIGHT_SCALE : 1;
      markerGroup.scale.setScalar(scale);
      markerGroup.children.forEach((c) => {
        if (!(c instanceof THREE.Mesh)) return;
        const mat = c.material;
        if (mat instanceof THREE.MeshStandardMaterial) {
          mat.color.setHex(isHighlight ? HIGHLIGHT_COLOR : NORMAL_COLOR);
          mat.emissive.setHex(isHighlight ? HIGHLIGHT_EMISSIVE : NORMAL_EMISSIVE);
          mat.emissiveIntensity = isHighlight ? 1.2 : 0.4;
        } else if (mat instanceof THREE.MeshBasicMaterial) {
          mat.color.setHex(isHighlight ? HIGHLIGHT_COLOR : NORMAL_COLOR);
          mat.opacity = isHighlight ? 0.55 : 0.18;
        }
      });
    });
  };

  const getMeshes = (): THREE.Mesh[] => {
    const out: THREE.Mesh[] = [];
    group.children.forEach((child) => {
      if (!(child instanceof THREE.Group)) return;
      child.children.forEach((c) => {
        if (c instanceof THREE.Mesh) out.push(c);
      });
    });
    return out;
  };

  const addCountries = (countries: Country[]): void => {
    while (group.children.length > 0) {
      const child = group.children[0];
      group.remove(child);
      if (child instanceof THREE.Group) {
        child.children.forEach((c) => {
          if (c instanceof THREE.Mesh) {
            c.geometry?.dispose();
            (c.material as THREE.Material)?.dispose();
          }
        });
      }
    }

    const withLatLng = countries.filter((c) => c.latlng && c.latlng.length >= 2);

    const stemHeight = MARKER_RADIUS * 4;
    const headRadius = MARKER_RADIUS * 1.6;

    const stemGeometry = new THREE.CylinderGeometry(
      MARKER_RADIUS * 0.35,
      MARKER_RADIUS * 0.35,
      stemHeight,
      12,
    );
    const headGeometry = new THREE.SphereGeometry(headRadius, MARKER_SEGMENTS, MARKER_SEGMENTS);
    const glowGeometry = new THREE.SphereGeometry(MARKER_GLOW_RADIUS, 16, 12);
    const hitGeometry = new THREE.SphereGeometry(MARKER_GLOW_RADIUS * 1.8, 12, 10);

    const up = new THREE.Vector3(0, 1, 0);

    for (const country of withLatLng) {
      const [lat, lng] = country.latlng!;
      const normal = latLngToVector3(lat, lng, 1).normalize();
      const baseDistance = GLOBE_RADIUS + 0.02;
      const basePos = normal.clone().multiplyScalar(baseDistance);

      const innerMat = new THREE.MeshStandardMaterial({
        color: NORMAL_COLOR,
        emissive: NORMAL_EMISSIVE,
        emissiveIntensity: 0.5,
        roughness: 0.3,
        metalness: 0.1,
      });

      const stem = new THREE.Mesh(stemGeometry.clone(), innerMat);
      stem.position.y = stemHeight / 2;

      const head = new THREE.Mesh(headGeometry.clone(), innerMat);
      head.position.y = stemHeight;

      const glowMat = new THREE.MeshBasicMaterial({
        color: NORMAL_COLOR,
        transparent: true,
        opacity: 0.2,
        depthWrite: false,
      });
      const glow = new THREE.Mesh(glowGeometry.clone(), glowMat);
      glow.scale.set(1.15, 0.45, 1.15);

      const hitMat = new THREE.MeshBasicMaterial({
        color: NORMAL_COLOR,
        transparent: true,
        opacity: 0,
        depthWrite: false,
      });
      const hit = new THREE.Mesh(hitGeometry.clone(), hitMat);
      hit.position.y = stemHeight * 0.6;

      const markerGroup = new THREE.Group();
      markerGroup.position.copy(basePos);
      markerGroup.userData = { countryCode: country.cca2 };
      markerGroup.add(stem);
      markerGroup.add(head);
      markerGroup.add(glow);
      markerGroup.add(hit);

      const quat = new THREE.Quaternion().setFromUnitVectors(up, normal);
      markerGroup.setRotationFromQuaternion(quat);

      group.add(markerGroup);
    }

    stemGeometry.dispose();
    headGeometry.dispose();
    glowGeometry.dispose();
    hitGeometry.dispose();
  };

  return {
    group,
    setHighlighted,
    addCountries,
    getMeshes,
  };
}
