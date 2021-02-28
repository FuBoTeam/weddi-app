import configService from "../services/configService";

const IMG_SIZE_S = "_small";
const IMG_SIZE_M = "";

// TODO: make it a service and do not need to concate urls
export const getImageUrl = (key, size = IMG_SIZE_S) =>
  `${configService.config.img.endpoint}${configService.config.img.namespace}/${key}${size}.jpg`;

export const IMG_SIZES = {
  IMG_SIZE_S,
  IMG_SIZE_M
};
