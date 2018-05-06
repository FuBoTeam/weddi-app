const IMG_ENDPOINT = `https://storage.googleapis.com/wedding_iota/`;

const IMG_SIZE_S = '_small';
const IMG_SIZE_M = '';

// Default is small size
const getFilenameByKey = (key, size = IMG_SIZE_S) => `${key}${size}`;

export const getImageURL = (size = IMG_SIZE_S) => {
  const filename = getFilenameByKey(0, size);
  return `${IMG_ENDPOINT}${filename}`;
};
