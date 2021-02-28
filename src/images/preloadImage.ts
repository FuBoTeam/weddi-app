export const preloadImage = (url: string, callback: (ev: Event) => any) => {
  const img = new Image();
  img.src = url;
  img.onload = callback;
};
