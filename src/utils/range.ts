export const range = (n: number): number[] => {
  return Array.from({length: n}).map((_, i) => i);
};
