export const preloadImage = (url: string, callback: (img: HTMLImageElement) => void): void => {
  const img = new Image();
  img.src = url;
  img.onload = (): void => callback(img);
};
