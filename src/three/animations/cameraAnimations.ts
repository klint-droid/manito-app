import gsap from 'gsap';
import type * as THREE from 'three';

export interface CameraTargetPose {
  position: [number, number, number];
  lookAt: [number, number, number];
  duration?: number;
  ease?: string;
}

export function getOverviewCameraPose(circleRadius: number, isMobile: boolean): CameraTargetPose {
  const distanceFactor = isMobile ? 2.55 : 1.95;
  const heightFactor = isMobile ? 1.55 : 1.25;
  return {
    position: [
      0,
      Math.max(5.8, circleRadius * heightFactor),
      Math.max(9.8, circleRadius * distanceFactor),
    ],
    lookAt: [0, 0.9, 0],
    duration: 1.35,
    ease: 'power3.inOut',
  };
}

export function getFocusCharacterPose(
  charPos: [number, number, number],
  isMobile: boolean,
): CameraTargetPose {
  const [x, y, z] = charPos;
  const dist = Math.hypot(x, z) || 1;
  const nx = x / dist;
  const nz = z / dist;
  const offset = isMobile ? 4.4 : 3.4;

  return {
    position: [x + nx * offset, y + 2.35, z + nz * offset],
    lookAt: [x, y + 1.05, z],
    duration: 1.1,
    ease: 'power2.inOut',
  };
}

export function getCenterStagePose(circleRadius: number, isMobile: boolean): CameraTargetPose {
  const zDist = Math.max(isMobile ? 9.6 : 7.8, circleRadius * (isMobile ? 1.85 : 1.45));
  return {
    position: [0, isMobile ? 5.2 : 4.3, zDist],
    lookAt: [0, 1.0, 0],
    duration: 1.15,
    ease: 'power2.inOut',
  };
}

export function getRevealCameraPose(isMobile: boolean): CameraTargetPose {
  return {
    position: [0, isMobile ? 3.55 : 2.9, isMobile ? 8.8 : 6.9],
    lookAt: [0, 1.12, 0.15],
    duration: 1.2,
    ease: 'power3.out',
  };
}

export function getGroupPhotoCameraPose(
  participantCount: number,
  isMobile: boolean,
): CameraTargetPose {
  const rowWidth = Math.min(6, Math.max(2, participantCount));
  const baseZ = isMobile ? 7.4 : 5.8;
  const extraZ = (rowWidth - 2) * (isMobile ? 0.95 : 0.72);
  const rows = Math.ceil(participantCount / (participantCount <= 10 ? 5 : 6));
  const y = (isMobile ? 3.1 : 2.65) + Math.max(0, rows - 1) * 0.45;

  return {
    position: [0, y, baseZ + extraZ],
    lookAt: [0, 1.15 + Math.max(0, rows - 1) * 0.12, 0.15],
    duration: 1.4,
    ease: 'power3.inOut',
  };
}

export function animateCameraToPose(
  camera: THREE.Camera,
  lookAtCurrent: THREE.Vector3,
  pose: CameraTargetPose,
  onUpdate?: () => void,
): gsap.core.Timeline {
  const tl = gsap.timeline();
  const duration = pose.duration ?? 1.2;
  const ease = pose.ease ?? 'power2.inOut';

  tl.to(
    camera.position,
    {
      x: pose.position[0],
      y: pose.position[1],
      z: pose.position[2],
      duration,
      ease,
      onUpdate: () => {
        camera.lookAt(lookAtCurrent);
        onUpdate?.();
      },
    },
    0,
  ).to(
    lookAtCurrent,
    {
      x: pose.lookAt[0],
      y: pose.lookAt[1],
      z: pose.lookAt[2],
      duration,
      ease,
      onUpdate: () => {
        camera.lookAt(lookAtCurrent);
        onUpdate?.();
      },
    },
    0,
  );

  return tl;
}
