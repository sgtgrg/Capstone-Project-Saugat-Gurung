import { useEffect, useRef, useState } from "react";
import { getFaceLandmarker } from "../rppg/faceLandmarker.js";
import { foreheadROI, meanRGB } from "../rppg/signal.js";

// Day 4: webcam capture + face region-of-interest tracking + live colour
// signal acquisition. This is the front of the rPPG pipeline; heart-rate
// estimation from this signal comes in the next iteration.
//
// Everything here runs locally in the browser. The video stream is never
// uploaded — only (later) the computed heart-rate numbers will be saved.

const SPARK_MAX = 200; // how many recent green-channel samples to plot

export default function Measure() {
  const videoRef = useRef(null);
  const overlayRef = useRef(null); // canvas drawn over the video (ROI box)
  const procRef = useRef(null); // hidden canvas used to read pixels
  const sparkRef = useRef(null); // small green-signal sparkline

  const streamRef = useRef(null);
  const rafRef = useRef(null);
  const greenBufRef = useRef([]); // recent green means (for sparkline)
  const lastUiUpdate = useRef(0);

  const [status, setStatus] = useState("idle"); // idle|loading|running|error
  const [errorMsg, setErrorMsg] = useState("");
  const [faceFound, setFaceFound] = useState(false);
  const [rgb, setRgb] = useState({ r: 0, g: 0, b: 0 });
  const [samples, setSamples] = useState(0);

  // Clean up camera + animation loop when leaving the page.
  useEffect(() => () => stopEverything(), []);

  function stopEverything() {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
  }

  async function start() {
    setErrorMsg("");
    setStatus("loading");
    greenBufRef.current = [];
    setSamples(0);

    try {
      // 1) Ask for the camera.
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: "user" },
        audio: false,
      });
      streamRef.current = stream;
      const video = videoRef.current;
      video.srcObject = stream;
      await video.play();

      // 2) Load the face model (cached after first time).
      const landmarker = await getFaceLandmarker();

      // 3) Size the canvases to the video.
      const vw = video.videoWidth || 640;
      const vh = video.videoHeight || 480;
      overlayRef.current.width = vw;
      overlayRef.current.height = vh;
      procRef.current.width = vw;
      procRef.current.height = vh;

      setStatus("running");
      loop(landmarker);
    } catch (err) {
      stopEverything();
      setStatus("error");
      setErrorMsg(friendlyError(err));
    }
  }

  function stop() {
    stopEverything();
    setStatus("idle");
    setFaceFound(false);
  }

  function loop(landmarker) {
    const video = videoRef.current;
    const overlay = overlayRef.current;
    const proc = procRef.current;
    if (!video || !overlay || !proc) return;

    const octx = overlay.getContext("2d");
    const pctx = proc.getContext("2d", { willReadFrequently: true });
    const vw = proc.width;
    const vh = proc.height;

    const step = () => {
      if (video.readyState >= 2 && video.videoWidth > 0) {
        // Draw the current frame to the hidden canvas for pixel reading.
        pctx.drawImage(video, 0, 0, vw, vh);

        const results = landmarker.detectForVideo(video, performance.now());
        octx.clearRect(0, 0, vw, vh);

        const landmarks = results?.faceLandmarks?.[0];
        if (landmarks) {
          const roi = foreheadROI(landmarks, vw, vh);
          const color = meanRGB(pctx, roi);

          // Draw the ROI box on the overlay (mirrored via CSS to match video).
          octx.strokeStyle = "#22d3ee";
          octx.lineWidth = 3;
          octx.strokeRect(roi.x, roi.y, roi.w, roi.h);

          // Record the green channel (strongest rPPG channel) for the plot.
          const buf = greenBufRef.current;
          buf.push(color.g);
          if (buf.length > SPARK_MAX) buf.shift();
          drawSparkline();

          // Throttle React state updates to ~10/sec.
          const now = performance.now();
          if (now - lastUiUpdate.current > 100) {
            lastUiUpdate.current = now;
            setFaceFound(true);
            setRgb(color);
            setSamples((s) => s + 1);
          }
        } else {
          setFaceFound(false);
        }
      }
      rafRef.current = requestAnimationFrame(step);
    };

    rafRef.current = requestAnimationFrame(step);
  }

  function drawSparkline() {
    const canvas = sparkRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const w = canvas.width;
    const h = canvas.height;
    const buf = greenBufRef.current;
    ctx.clearRect(0, 0, w, h);
    if (buf.length < 2) return;

    // Auto-scale to the recent min/max so the pulse wiggle is visible.
    let min = Infinity;
    let max = -Infinity;
    for (const v of buf) {
      if (v < min) min = v;
      if (v > max) max = v;
    }
    const range = max - min || 1;

    ctx.beginPath();
    ctx.strokeStyle = "#4f46e5";
    ctx.lineWidth = 2;
    buf.forEach((v, i) => {
      const x = (i / (SPARK_MAX - 1)) * w;
      const y = h - ((v - min) / range) * (h - 6) - 3;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-slate-900">rPPG Session</h1>
        <p className="text-slate-600 mt-1">
          A short webcam session reads subtle colour changes in your skin to
          estimate your pulse. Sit still in good, even lighting and keep your
          forehead visible. Your video never leaves this device.
        </p>
      </header>

      <div className="bg-white border border-slate-200 rounded-xl p-4">
        {/* Video + overlay */}
        <div className="relative w-full max-w-md mx-auto aspect-[4/3] bg-slate-900 rounded-lg overflow-hidden">
          <video
            ref={videoRef}
            playsInline
            muted
            className="absolute inset-0 w-full h-full object-cover"
            style={{ transform: "scaleX(-1)" }}
          />
          <canvas
            ref={overlayRef}
            className="absolute inset-0 w-full h-full"
            style={{ transform: "scaleX(-1)" }}
          />
          {status === "idle" && (
            <div className="absolute inset-0 flex items-center justify-center text-slate-300 text-sm">
              Camera is off
            </div>
          )}
          {status === "loading" && (
            <div className="absolute inset-0 flex items-center justify-center text-slate-200 text-sm">
              Starting camera & loading face model…
            </div>
          )}
        </div>

        {/* Hidden processing canvas */}
        <canvas ref={procRef} className="hidden" />

        {/* Controls */}
        <div className="flex items-center justify-center gap-3 mt-4">
          {status !== "running" ? (
            <button
              onClick={start}
              disabled={status === "loading"}
              className="bg-brand hover:bg-brand-dark text-white font-medium px-5 py-2 rounded-md disabled:opacity-60"
            >
              {status === "loading" ? "Starting…" : "Start camera"}
            </button>
          ) : (
            <button
              onClick={stop}
              className="bg-slate-700 hover:bg-slate-800 text-white font-medium px-5 py-2 rounded-md"
            >
              Stop
            </button>
          )}
        </div>

        {errorMsg && (
          <p className="mt-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-md px-3 py-2 text-center">
            {errorMsg}
          </p>
        )}
      </div>

      {/* Live signal panel */}
      {status === "running" && (
        <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-slate-800">Live signal</h2>
            <span
              className={`text-sm font-medium ${
                faceFound ? "text-emerald-600" : "text-amber-600"
              }`}
            >
              {faceFound ? "● Face detected" : "○ No face — center your face"}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center">
            <Metric label="Red" value={rgb.r} color="text-rose-600" />
            <Metric label="Green" value={rgb.g} color="text-emerald-600" />
            <Metric label="Blue" value={rgb.b} color="text-blue-600" />
          </div>

          <div>
            <p className="text-xs text-slate-500 mb-1">
              Green-channel signal (the basis for heart-rate estimation)
            </p>
            <canvas
              ref={sparkRef}
              width={600}
              height={80}
              className="w-full h-20 bg-slate-50 rounded-md border border-slate-200"
            />
          </div>

          <p className="text-xs text-slate-400">
            Samples captured: {samples}. Next step (coming soon): convert this
            signal into heart rate using the CHROM method + FFT.
          </p>
        </div>
      )}
    </div>
  );
}

function Metric({ label, value, color }) {
  return (
    <div className="bg-slate-50 rounded-lg p-3">
      <div className={`text-2xl font-bold ${color}`}>{value.toFixed(1)}</div>
      <div className="text-xs text-slate-500">{label}</div>
    </div>
  );
}

function friendlyError(err) {
  const name = err?.name || "";
  if (name === "NotAllowedError" || name === "SecurityError") {
    return "Camera permission was denied. Allow camera access in your browser and try again.";
  }
  if (name === "NotFoundError" || name === "DevicesNotFoundError") {
    return "No camera was found on this device.";
  }
  if (name === "NotReadableError") {
    return "The camera is in use by another app. Close it and try again.";
  }
  return "Could not start the camera/face model. Check your connection and try again.";
}
