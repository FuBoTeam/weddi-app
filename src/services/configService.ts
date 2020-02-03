interface Config {
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

const CHYY_CONFIG: Config = {
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
    endpoint: "https://storage.googleapis.com/image.weddi.app/",
    totalImgs: 114,
    bgImgsShouldBePicked: 40,
    fmImgsShouldBePicked: 5
  }
};

const TLTY_CONFIG: Config = {
  doc: {
    title: "<3 Tony & Claire <3"
  },
  firebase: {
    apiKey: "AIzaSyD_1irJWOgT9x5fvmbXJm0fRRRZ8DNUfpU",
    authDomain: "weddi-app.firebaseapp.com",
    databaseURL: "https://weddi-app-tlty.firebaseio.com/",
    projectId: "weddi-app",
    storageBucket: "image.weddi.app",
    messagingSenderId: "324415165027",
    appId: "1:324415165027:web:76b8291835ef32c5c75e56"
  },
  img: {
    namespace: "tlty",
    endpoint: "https://storage.googleapis.com/image.weddi.app/",
    totalImgs: 30,
    bgImgsShouldBePicked: 30,
    fmImgsShouldBePicked: 5
  }
};

const TEST_CONFIG: Config = {
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
    endpoint: "https://storage.googleapis.com/image.weddi.app/",
    totalImgs: 114,
    bgImgsShouldBePicked: 40,
    fmImgsShouldBePicked: 5
  }
};

const getConfigById = (gnbId: string): Config => {
  switch (gnbId) {
    case "chyy":
      return CHYY_CONFIG;
    case "tlty":
      return TLTY_CONFIG;
    default:
      return TEST_CONFIG;
  }
};

export class ConfigService {
  private _config?: Config;

  public init(gnbId: string): void {
    if (!this._config) {
      this._config = getConfigById(gnbId);
    }
  }

  public get config(): Config {
    if (!this._config) {
      throw Error("config is not set yet");
    }
    return this._config;
  }
}

const configService: ConfigService = new ConfigService();

export default configService;
