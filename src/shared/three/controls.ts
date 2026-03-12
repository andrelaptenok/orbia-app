import * as THREE from "three";
import CameraControls from "camera-controls";
import { CAMERA_DISTANCE, MIN_DIST, MAX_DIST, ZOOM_STEP } from "./constants";

export interface CameraControlContext {
  camera: THREE.PerspectiveCamera;
  controls: CameraControls;
  zoomIn: () => void;
  zoomOut: () => void;
}

export function createCameraAndControls(): CameraControlContext {
  const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);

  CameraControls.install({ THREE });
  const controls = new CameraControls(camera);
  controls.minDistance = MIN_DIST;
  controls.maxDistance = MAX_DIST;
  controls.dampingFactor = 0.05;
  controls.draggingDampingFactor = 0.25;
  controls.dollySpeed = 2.8;
  controls.setLookAt(0, 0, CAMERA_DISTANCE, 0, 0, 0, false);

  function zoom(direction: 1 | -1): void {
    const origin = new THREE.Vector3(0, 0, 0);
    const currentDist = camera.position.distanceTo(origin);
    const newDist = THREE.MathUtils.clamp(currentDist + direction * ZOOM_STEP, MIN_DIST, MAX_DIST);
    const pos = camera.position.clone().normalize().multiplyScalar(newDist);
    controls.setLookAt(pos.x, pos.y, pos.z, 0, 0, 0, true);
  }

  const zoomIn = (): void => zoom(-1);
  const zoomOut = (): void => zoom(1);

  return { camera, controls, zoomIn, zoomOut };
}
