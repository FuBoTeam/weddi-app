const CHYY_CONFIG: ConfigService.Config = {
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
  post: {
    namespace: "chyy",
  },
  img: {
    namespace: "chyy",
    endpoint: "https://storage.googleapis.com/image.weddi.app/",
    totalImgs: 114,
    bgImgsShouldBePicked: 40,
    fmImgsShouldBePicked: 5
  }
};

const TLTY_CONFIG: ConfigService.Config = {
  doc: {
    title: "<3 Tony & Claire <3"
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
  post: {
    namespace: "tlty",
  },
  img: {
    namespace: "tlty",
    endpoint: "https://storage.googleapis.com/image.weddi.app/",
    totalImgs: 30,
    bgImgsShouldBePicked: 30,
    fmImgsShouldBePicked: 5
  }
};

const YKYL_CONFIG: ConfigService.Config = {
  doc: {
    title: "<3 呱呱 & 以練 <3"
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
  post: {
    namespace: "ykyl",
  },
  img: {
    namespace: "ykyl",
    endpoint: "https://storage.googleapis.com/image.weddi.app/",
    totalImgs: 28,
    bgImgsShouldBePicked: 28,
    fmImgsShouldBePicked: 5
  }
};

const TEST_CONFIG: ConfigService.Config = {
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
  post: {
    namespace: "test",
  },
  img: {
    namespace: "chyy",
    endpoint: "https://storage.googleapis.com/image.weddi.app/",
    totalImgs: 114,
    bgImgsShouldBePicked: 40,
    fmImgsShouldBePicked: 5
  }
};

const getConfigById = (gnbId: string): ConfigService.Config => {
  switch (gnbId) {
    case "chyy":
      return CHYY_CONFIG;
    case "tlty":
      return TLTY_CONFIG;
    case "ykyl":
      return YKYL_CONFIG;
    default:
      return TEST_CONFIG;
  }
};

class ConfigService implements ConfigServiceInterface {
  private _config: ConfigService.Config | null = null;

  public init(gnbId: string): void {
    if (this._config === null) {
      this._config = getConfigById(gnbId);
    }
  }

  public get config(): ConfigService.Config {
    if (this._config === null) {
      throw Error("config is not set yet");
    }
    return this._config;
  }
}

// Singleton
const configService: ConfigServiceInterface = new ConfigService();

export default configService;
