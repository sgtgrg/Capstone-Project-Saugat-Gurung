// The Perceived Stress Scale (PSS-10), Cohen et al. (1983).
// 10 questions, each answered 0–4. Items 4, 5, 7, 8 are positively worded and
// are reverse-scored on the backend (we only collect the raw 0–4 here).

export const PSS10_QUESTIONS = [
  "In the last month, how often have you been upset because of something that happened unexpectedly?",
  "In the last month, how often have you felt that you were unable to control the important things in your life?",
  "In the last month, how often have you felt nervous and stressed?",
  "In the last month, how often have you felt confident about your ability to handle your personal problems?",
  "In the last month, how often have you felt that things were going your way?",
  "In the last month, how often have you found that you could not cope with all the things that you had to do?",
  "In the last month, how often have you been able to control irritations in your life?",
  "In the last month, how often have you felt that you were on top of things?",
  "In the last month, how often have you been angered because of things that were outside of your control?",
  "In the last month, how often have you felt difficulties were piling up so high that you could not overcome them?",
];

// Response scale (value sent to the backend -> label shown to the user).
export const PSS10_SCALE = [
  { value: 0, label: "Never" },
  { value: 1, label: "Almost never" },
  { value: 2, label: "Sometimes" },
  { value: 3, label: "Fairly often" },
  { value: 4, label: "Very often" },
];

// The four daily factors, scored 1–10.
export const FACTORS = [
  { key: "sleep", label: "Sleep quality", low: "Poor", high: "Excellent" },
  { key: "workload", label: "Workload", low: "Very light", high: "Very heavy" },
  { key: "focus", label: "Focus / concentration", low: "Scattered", high: "Sharp" },
  { key: "mood", label: "Mood", low: "Very low", high: "Very good" },
];
