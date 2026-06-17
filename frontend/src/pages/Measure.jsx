// rPPG measurement page (webcam → CHROM → heart rate / HRV).
// Scaffold placeholder — built on Days 4-7 (Jun 23-27). All processing local.
export default function Measure() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      <h1 className="text-xl font-bold text-slate-900">rPPG Session</h1>
      <p className="text-slate-600 mt-2">
        Webcam capture, face ROI detection, the CHROM algorithm, bandpass +
        FFT heart-rate estimation and HRV metrics will be built here on
        Jun 23–27. No video ever leaves your device.
      </p>
      <span className="inline-block mt-4 text-xs font-medium text-brand bg-indigo-50 px-2 py-1 rounded">
        Coming soon
      </span>
    </div>
  );
}
