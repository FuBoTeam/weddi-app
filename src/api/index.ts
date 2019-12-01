import * as firebase from "firebase/app";
import "firebase/database";
import "firebase/storage";

import { Config } from "../config";

class FirebaseApi {
  config?: Config;
  app?: firebase.app.App;
  init(config: Config) {
    if (!this.app) {
      this.config = config;
      this.app = firebase.initializeApp(this.config.firebase);
    }
  }

  get database(): firebase.database.Database {
    if (!this.app) {
      throw new Error("app is not initial yet");
    }
    return this.app.database();
  }

  get storage(): firebase.storage.Storage {
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

export const writePost = (postData: object) => {
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

export const onNewPost = (callback: Function) => {
  const postRef = firebaseApi.database.ref("posts");
  postRef.on("child_added", (data: firebase.database.DataSnapshot) => {
    callback(data.val());
  });
};

export const listAllImages = () => {
  if (!firebaseApi.config) {
    throw new Error("app is not initial yet");
  }
  return firebaseApi.storage.ref(firebaseApi.config.img.namespace).listAll();
};

export const uploadImage = (imgName: string, image: Blob) => {
  if (!firebaseApi.config) {
    throw new Error("app is not initial yet");
  }
  return firebaseApi.storage
    .ref(firebaseApi.config.img.namespace)
    .child("public_upload")
    .child(imgName)
    .put(image);
};
