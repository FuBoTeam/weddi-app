import * as firebase from "firebase/app";
import "firebase/database";
import "firebase/storage";

import { Config } from "../config";
import { ArrowFunctionExpression } from "@babel/types";

class FirebaseApi {
  _config?: Config;
  private _app?: firebase.app.App;
  private _database?: Register<firebase.database.Reference>;
  private _storage?: Register<firebase.storage.Reference>;
  public init(config: Config): void {
    // init app
    if (!this._app) {
      this._config = config;
      this._app = firebase.initializeApp(this._config.firebase);
    }

    if (!this._database) {
      this._database = new Register<firebase.database.Reference>(
        this._app.database().ref(),
        "database"
      );
      this._database.register(posts, this._app.database().ref("posts"));
    }

    if (!this._storage) {
      this._storage = new Register<firebase.storage.Reference>(
        this._app.storage().ref(),
        "storage"
      );
      this._storage.register(
        images,
        this._app.storage().ref(this._config!.img.namespace)
      );
    }
  }

  public get database() {
    return this._database!.topics;
  }

  public get storage() {
    return this._storage!.topics;
  }
}

const firebaseApi = new FirebaseApi();
export default firebaseApi;

class Register<R> implements RegisterType<R> {
  private _name: string;
  private _rootReference: R;
  private _topics: {
    [topic: string]: ReturnType<Topic<R>>;
  } = {};

  public constructor(rootRef: R, name?: string) {
    this._rootReference = rootRef;
    this._name = name || "defaultRegister";
  }

  public register(topic: Topic<R>, ref?: R): Function {
    if (this._topics[topic.name] !== undefined) {
      throw new Error(`topic ${topic.name} is registered`);
    }
    const reference = ref || this._rootReference;
    this._topics[topic.name] = topic(reference);

    return topic;
  }

  public deregister(topic: Topic<R>): void {
    delete this._topics[topic.name];
  }

  public get topics() {
    return this._topics;
  }
}

interface RegisterType<R> {
  register: (topic: Topic<R>, ref?: R, name?: string) => Function;
  deregister: (topic: Topic<R>) => void;
  topics: {
    [topic: string]: ReturnType<Topic<R>>;
  };
}

type Topic<R> = (
  Ref: R
) => {
  [subTopic: string]: Function | ArrowFunctionExpression;
};

const posts: Topic<firebase.database.Reference> = (
  postRef: firebase.database.Reference
) => {
  const write = (postData: object) => {
    const postId = postRef.push().key!;
    const wrappedPostData = {
      ...postData,
      modifiedTime: new Date().toISOString(),
      userAgent: navigator.userAgent,
      id: postId
    };

    return postRef.child(postId).set(wrappedPostData);
  };

  const onAdded = (callback: Function) => {
    postRef.on("child_added", (data: firebase.database.DataSnapshot) => {
      callback(data.val());
    });
  };

  return {
    write,
    onAdded
  };
};

const images: Topic<firebase.storage.Reference> = (
  imgRef: firebase.storage.Reference
) => {
  const listAll = () => imgRef.listAll();
  const upload = (imgName: string, image: Blob) =>
    imgRef
      .child("public_upload")
      .child(imgName)
      .put(image);

  return {
    listAll,
    upload
  };
};
