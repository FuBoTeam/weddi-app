const CHYY_IMG_ENDPOINT = `https://storage.googleapis.com/image.weddi.app/chyy/`;
const TLTY_IMG_ENDPOINT = `https://storage.googleapis.com/image.weddi.app/tlty/`;
const TEST_IMG_ENDPOINT = `https://storage.googleapis.com/image.weddi.app/chyy/`;

const IMG_SIZE_S = '_small';
const IMG_SIZE_M = '';

const getImgEndpointById = (gnbId) => {
  switch(gnbId) {
  case 'chyy':
    return CHYY_IMG_ENDPOINT;
  case 'tlty':
    return TLTY_IMG_ENDPOINT;
  default:
    return TEST_IMG_ENDPOINT;
  }
}

let imgEndpoint;

const init = (gnbId) => {
  if (!imgEndpoint) {
    imgEndpoint = getImgEndpointById(gnbId);
  }
  return imgEndpoint;
}

export const getImageUrl = (key, size = IMG_SIZE_S) => {
  return `${imgEndpoint}${key}${size}.jpg`;
};

export const IMG_SIZES = {
  IMG_SIZE_S,
  IMG_SIZE_M
};

export default {
  init,
};
