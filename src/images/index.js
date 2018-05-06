const IMG_ENDPOINT = `https://storage.googleapis.com/wedding_iota/`;

const IMG_SIZE_S = '_small';
const IMG_SIZE_M = '';

export const getImageUrl = (key, size = IMG_SIZE_S) => {
  return `${IMG_ENDPOINT}${key}${size}.jpg`;
};
