// Helpers for turning face landmarks into a region of interest (ROI) and
// extracting the average colour of that region from a video frame.
//
// The forehead is a good rPPG site: it has strong blood-volume signal and few
// movement artifacts. We take a spread of forehead landmarks, find their
// bounding box, then inset it slightly so the box stays on skin.

// A spread of MediaPipe Face Mesh landmark indices around the forehead.
export const FOREHEAD_LANDMARKS = [
  10, 67, 69, 104, 108, 151, 337, 299, 297, 338, 109, 66, 105, 296, 334, 333,
];

// Compute a pixel-space ROI rectangle {x, y, w, h} from normalized landmarks.
// `width`/`height` are the video's intrinsic pixel dimensions.
export function foreheadROI(landmarks, width, height, inset = 0.15) {
  let minX = 1,
    minY = 1,
    maxX = 0,
    maxY = 0;

  for (const idx of FOREHEAD_LANDMARKS) {
    const p = landmarks[idx];
    if (!p) continue;
    if (p.x < minX) minX = p.x;
    if (p.y < minY) minY = p.y;
    if (p.x > maxX) maxX = p.x;
    if (p.y > maxY) maxY = p.y;
  }

  let x = minX * width;
  let y = minY * height;
  let w = (maxX - minX) * width;
  let h = (maxY - minY) * height;

  // Shrink toward the centre so the box avoids hairline/eyebrows.
  const ix = w * inset;
  const iy = h * inset;
  x += ix;
  y += iy;
  w -= 2 * ix;
  h -= 2 * iy;

  return {
    x: Math.max(0, Math.round(x)),
    y: Math.max(0, Math.round(y)),
    w: Math.max(1, Math.round(w)),
    h: Math.max(1, Math.round(h)),
  };
}

// Average R, G, B over the ROI of a 2D canvas context (values 0–255).
export function meanRGB(ctx, roi) {
  const { x, y, w, h } = roi;
  const { data } = ctx.getImageData(x, y, w, h);

  let r = 0,
    g = 0,
    b = 0;
  const pixels = data.length / 4;
  for (let i = 0; i < data.length; i += 4) {
    r += data[i];
    g += data[i + 1];
    b += data[i + 2];
  }
  if (pixels === 0) return { r: 0, g: 0, b: 0 };
  return { r: r / pixels, g: g / pixels, b: b / pixels };
}
