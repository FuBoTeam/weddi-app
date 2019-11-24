import Config from "../config";

const IMG_SIZE_S = '_small';
const IMG_SIZE_M = '';

export const getImageUrl = (key, size = IMG_SIZE_S) =>
  `${Config.img.endpoint}${key}${size}.jpg`;

export const IMG_SIZES = {
  IMG_SIZE_S,
  IMG_SIZE_M
};
