interface IConfig {
  doc: DocumentConfig;
  firebase: FirebaseConfig;
  img: ImageConfig;
}

interface DocumentConfig {
  title: string;
}

interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  databaseURL: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

interface ImageConfig {
  namespace: string;
  endpoint: string;
  totalImgs: number;
  bgImgsShouldBePicked: number;
  fmImgsShouldBePicked: number;
}

const CHYY_CONFIG: IConfig = {
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

const TLTY_CONFIG: IConfig = {
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

const TEST_CONFIG: IConfig = {
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

const getConfigById = (gnbId: String): IConfig => {
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
  config?: IConfig;

  init(gnbId: String): void {
    if (!this.config) {
      this.config = getConfigById(gnbId);
    }
  }

  get doc(): DocumentConfig {
    if (this.config) {
      return this.config.doc;
    }
    throw Error("config is not set yet");
  }

  get firebase(): FirebaseConfig {
    if (this.config) {
      return this.config.firebase;
    }
    throw Error("config is not set yet");
  }

  get img(): ImageConfig {
    if (this.config) {
      return this.config.img;
    }
    throw Error("config is not set yet");
  }
}

const config: Config = new Config();

export default config;
