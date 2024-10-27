// constants/discOptions.js
export const speedOptions = Array.from({ length: 13 }, (_, i) => ({ label: (i + 1).toString(), value: i + 1 }));
export const glideOptions = Array.from({ length: 7 }, (_, i) => ({ label: (i + 1).toString(), value: i + 1 }));
export const turnOptions = Array.from({ length: 13 }, (_, i) => {
  const value = -5 + i * 0.5;
  return { label: value.toString(), value };
});
export const fadeOptions = Array.from({ length: 11 }, (_, i) => {
  const value = i * 0.5;
  return { label: value.toString(), value };
});
