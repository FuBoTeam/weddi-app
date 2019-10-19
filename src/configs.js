const CHYY_CONFIG = {
  doc: {
    title: "<3 YaYun & ChinHui <3"
  },
  db: {
    apiKey: "AIzaSyD_1irJWOgT9x5fvmbXJm0fRRRZ8DNUfpU",
    authDomain: "weddi-app.firebaseapp.com",
    databaseURL: "https://weddi-app.firebaseio.com/",
    projectId: "weddi-app",
    storageBucket: "weddi-app.appspot.com",
    messagingSenderId: "324415165027",
    appId: "1:324415165027:web:76b8291835ef32c5c75e56"
  },
  img: {
    endpoint: "https://storage.googleapis.com/image.weddi.app/chyy/",
    totalImgs: 114,
    bgImgsShouldBePicked: 40,
    fmImgsShouldBePicked: 5
  }
};

const TLTY_CONFIG = {
  doc: {
    title: "<3 水母 & 印麥王 <3"
  },
  db: {
    apiKey: "AIzaSyD_1irJWOgT9x5fvmbXJm0fRRRZ8DNUfpU",
    authDomain: "weddi-app.firebaseapp.com",
    databaseURL: "https://weddi-app-test.firebaseio.com/",
    projectId: "weddi-app",
    storageBucket: "weddi-app.appspot.com",
    messagingSenderId: "324415165027",
    appId: "1:324415165027:web:76b8291835ef32c5c75e56"
  },
  img: {
    endpoint: "https://storage.googleapis.com/image.weddi.app/tlty/",
    totalImgs: 30,
    bgImgsShouldBePicked: 30,
    fmImgsShouldBePicked: 5
  }
};

const TEST_CONFIG = {
  doc: {
    title: "<3 Groom & Bride <3"
  },
  db: {
    apiKey: "AIzaSyD_1irJWOgT9x5fvmbXJm0fRRRZ8DNUfpU",
    authDomain: "weddi-app.firebaseapp.com",
    databaseURL: "https://weddi-app-test.firebaseio.com/",
    projectId: "weddi-app",
    storageBucket: "weddi-app.appspot.com",
    messagingSenderId: "324415165027",
    appId: "1:324415165027:web:76b8291835ef32c5c75e56"
  },
  img: {
    endpoint: "https://storage.googleapis.com/image.weddi.app/chyy/",
    totalImgs: 114,
    bgImgsShouldBePicked: 40,
    fmImgsShouldBePicked: 5
  }
};

const setConfigById = gnbId => {
  switch (gnbId) {
    case "chyy":
      return CHYY_CONFIG;
    case "tlty":
      return TLTY_CONFIG;
    default:
      return TEST_CONFIG;
  }
};

let config;

const init = gnbId => {
  if (!config) {
    config = setConfigById(gnbId);
  }
  return config;
};

const getDocConfig = () => config.doc;
const getDBConfig = () => config.db;
const getImgConfig = () => config.img;

export default {
  init,
  getDocConfig,
  getDBConfig,
  getImgConfig
};
