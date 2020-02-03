import * as firebase from "firebase/app";
import "firebase/database";
import "firebase/storage";

import { Config } from "../services/config";

class FirebaseApi {
  public config?: Config;
  private app?: firebase.app.App;
  public init(config: Config): void {
    if (!this.app) {
      this.config = config;
      this.app = firebase.initializeApp(this.config.firebase);
    }
  }

  public get database(): firebase.database.Database {
    if (!this.app) {
      throw new Error("app is not initial yet");
    }
    return this.app.database();
  }

  public get storage(): firebase.storage.Storage {
    if (!this.app) {
      throw new Error("app is not initial yet");
    }
    return this.app.storage();
  }
}

const firebaseApi = new FirebaseApi();
export default firebaseApi;

// TODO: refactor to be registration api sets, i.e.
// firebaseApi.dbRegister(posts)
//
// posts = (dbRef) => ({
//   write: data => {
//     id = dbRef.push().key
//     return dbRef.child(id).set(data)
//   },
//   onAdded: ...
// })
//
// firebaseApi.storageRegister(imgs)
// imgs = (storageRef) => ...
//

export const writePost = (postData: object): Promise<object> => {
  const postId = firebaseApi.database.ref("posts").push().key;
  if (!postId) {
    throw new Error("post id is empty");
  }
  const wrappedPostData = {
    ...postData,
    modifiedTime: new Date().toISOString(),
    userAgent: navigator.userAgent,
    id: postId
  };
  return firebaseApi.database
    .ref("posts")
    .child(postId)
    .set(wrappedPostData);
};

export const onNewPost = (callback: Function): void => {
  const postRef = firebaseApi.database.ref("posts");
  postRef.on("child_added", (data: firebase.database.DataSnapshot) => {
    callback(data.val());
  });
};

export const listAllImages = (): Promise<firebase.storage.ListResult> => {
  if (!firebaseApi.config) {
    throw new Error("app is not initial yet");
  }
  return firebaseApi.storage.ref(firebaseApi.config.img.namespace).listAll();
};

export const uploadImage = (imgName: string, image: Blob): firebase.storage.UploadTask => {
  if (!firebaseApi.config) {
    throw new Error("app is not initial yet");
  }
  return firebaseApi.storage
    .ref(firebaseApi.config.img.namespace)
    .child("public_upload")
    .child(imgName)
    .put(image);
};
