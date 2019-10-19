import Configs from "../configs";

const IMG_SIZE_S = '_small';
const IMG_SIZE_M = '';

export const getImageUrl = (key, size = IMG_SIZE_S) =>
  `${Configs.getImgConfig().endpoint}${key}${size}.jpg`;

export const IMG_SIZES = {
  IMG_SIZE_S,
  IMG_SIZE_M
};
