import configService from "../services/configService";

const IMG_SIZE_S = "_small";
const IMG_SIZE_M = "";

export const preloadImage = (url, callback) => {
  const img = new Image();
  img.src = url;
  img.onload = callback;
};

// TODO: make it a service and do not need to concate urls
export const getImageUrl = (key, size = IMG_SIZE_S) =>
  `${configService.img.endpoint}${configService.img.namespace}/${key}${size}.jpg`;

export const IMG_SIZES = {
  IMG_SIZE_S,
  IMG_SIZE_M
};
