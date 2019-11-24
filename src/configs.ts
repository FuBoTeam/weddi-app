interface RootConfig {
  doc: DocumentConfig;
  firebase: FirebaseConfig;
  img: ImageConfig;
}

interface DocumentConfig {
  title: String;
}

interface FirebaseConfig {
  apiKey: String;
  authDomain: String;
  databaseURL: String;
  projectId: String;
  storageBucket: String;
  messagingSenderId: String;
  appId: String;
}

interface ImageConfig {
  namespace: String;
  endpoint: String;
  totalImgs: Number;
  bgImgsShouldBePicked: Number;
  fmImgsShouldBePicked: Number;
}

const CHYY_CONFIG: RootConfig = {
  doc: {
    title: "<3 YaYun & ChinHui <3"
  },
  firebase: {
    apiKey: "AIzaSyD_1irJWOgT9x5fvmbXJm0fRRRZ8DNUfpU",
    authDomain: "weddi-app.firebaseapp.com",
    databaseURL: "https://weddi-app.firebaseio.com/",
    projectId: "weddi-app",
    storageBucket: "image.weddi.app",
    messagingSenderId: "324415165027",
    appId: "1:324415165027:web:76b8291835ef32c5c75e56"
  },
  img: {
    namespace: "chyy",
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
  firebase: {
    apiKey: "AIzaSyD_1irJWOgT9x5fvmbXJm0fRRRZ8DNUfpU",
    authDomain: "weddi-app.firebaseapp.com",
    databaseURL: "https://weddi-app-test.firebaseio.com/",
    projectId: "weddi-app",
    storageBucket: "image.weddi.app",
    messagingSenderId: "324415165027",
    appId: "1:324415165027:web:76b8291835ef32c5c75e56"
  },
  img: {
    namespace: "tlty",
    endpoint: "https://storage.googleapis.com/image.weddi.app/tlty/",
    totalImgs: 30,
    bgImgsShouldBePicked: 30,
    fmImgsShouldBePicked: 5
  }
};

const TEST_CONFIG: RootConfig = {
  doc: {
    title: "<3 Groom & Bride <3"
  },
  firebase: {
    apiKey: "AIzaSyD_1irJWOgT9x5fvmbXJm0fRRRZ8DNUfpU",
    authDomain: "weddi-app.firebaseapp.com",
    databaseURL: "https://weddi-app-test.firebaseio.com/",
    projectId: "weddi-app",
    storageBucket: "image.weddi.app",
    messagingSenderId: "324415165027",
    appId: "1:324415165027:web:76b8291835ef32c5c75e56"
  },
  img: {
    namespace: "chyy",
    endpoint: "https://storage.googleapis.com/image.weddi.app/chyy/",
    totalImgs: 114,
    bgImgsShouldBePicked: 40,
    fmImgsShouldBePicked: 5
  }
};

const getConfigById = (gnbId: String): RootConfig => {
  switch (gnbId) {
    case "chyy":
      return CHYY_CONFIG;
    case "tlty":
      return TLTY_CONFIG;
    default:
      return TEST_CONFIG;
  }
};

class Config {
  config?: RootConfig;

  init(gnbId: String) {
    if (!this.config) {
      this.config = getConfigById(gnbId);
    }
  }

  get doc() {
    if (this.config) {
      return this.config.doc;
    }
    throw Error("config is not set yet");
  }

  get firebase() {
    if (this.config) {
      return this.config.firebase;
    }
    throw Error("config is not set yet");
  }

  get img() {
    if (this.config) {
      return this.config.img;
    }
    throw Error("config is not set yet");
  }
}

const config: Config = new Config();

export default config;
