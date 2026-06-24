// Loads the MediaPipe FaceLandmarker model once and reuses it.
//
// The WASM runtime and the model file are fetched from a CDN at runtime (they
// are NOT bundled), so the first run needs an internet connection. After that
// the browser caches them. All detection then happens locally in the browser —
// no video ever leaves the device, which is the project's privacy guarantee.

import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";

// Keep this in sync with the version in package.json so the WASM matches the JS.
const TASKS_VISION_VERSION = "0.10.14";

const WASM_URL = `https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@${TASKS_VISION_VERSION}/wasm`;
const MODEL_URL =
  "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task";

let landmarkerPromise = null;

// Returns a promise that resolves to a ready FaceLandmarker (singleton).
export function getFaceLandmarker() {
  if (!landmarkerPromise) {
    landmarkerPromise = (async () => {
      const fileset = await FilesetResolver.forVisionTasks(WASM_URL);
      return FaceLandmarker.createFromOptions(fileset, {
        baseOptions: {
          modelAssetPath: MODEL_URL,
          delegate: "GPU", // falls back gracefully; CPU also works
        },
        runningMode: "VIDEO",
        numFaces: 1,
      });
    })();
  }
  return landmarkerPromise;
}

// Allow callers to reset (e.g. if loading failed and we want to retry).
export function resetFaceLandmarker() {
  landmarkerPromise = null;
}
