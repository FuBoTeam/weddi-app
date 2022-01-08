export const preloadImage = (url: string, callback: (img: HTMLImageElement) => void): void => {
  const img = new Image();
  img.src = url;
  img.onload = (): void => callback(img);
};

export const preloadImageAsync = (url: string): Promise<HTMLImageElement> => {
  return new Promise(resolve => {
    preloadImage(url, resolve);
  });
};
