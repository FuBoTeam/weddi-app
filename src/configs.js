const CHYY_TOTAL_IMGS = 114;
const CHYY_BG_IMGS_SHOULD_BE_PICKED = 40;
const CHYY_FM_IMGS_SHOULD_BE_PICKED = 5;

const TLTY_TOTAL_IMGS = 30;
const TLTY_BG_IMGS_SHOULD_BE_PICKED = 30;
const TLTY_FM_IMGS_SHOULD_BE_PICKED = 5;

const setConfigById = (gnbId) => {
  switch(gnbId) {
  case 'chyy':
    return {
      totalImgs: CHYY_TOTAL_IMGS,
      bgImgsShouldBePicked: CHYY_BG_IMGS_SHOULD_BE_PICKED,
      fmImgsShouldBePicked: CHYY_FM_IMGS_SHOULD_BE_PICKED,
    };
  case 'tlty':
    return {
      totalImgs: TLTY_TOTAL_IMGS,
      bgImgsShouldBePicked: TLTY_BG_IMGS_SHOULD_BE_PICKED,
      fmImgsShouldBePicked: TLTY_FM_IMGS_SHOULD_BE_PICKED,
    };
  default:
    return {
      totalImgs: CHYY_TOTAL_IMGS,
      bgImgsShouldBePicked: CHYY_BG_IMGS_SHOULD_BE_PICKED,
      fmImgsShouldBePicked: CHYY_FM_IMGS_SHOULD_BE_PICKED,
    };
  }
};

let config;

const init = (gnbId) => {
  if (!config) {
    config = setConfigById(gnbId);
    console.log('config', config)
  }
  return config;
}

export const getTotalImgs = () => config.totalImgs;
export const getBgImgsShouldBePicked = () => config.bgImgsShouldBePicked;
export const getFmImgsShouldBePicked = () => config.fmImgsShouldBePicked;

export default {
  init,
};
