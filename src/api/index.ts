import * as firebase from "firebase/app";
import "firebase/database";
import "firebase/storage";

import Config from "../config";

class apiBase {
  app: firebase.app.App;
  database: firebase.database.Database;
  storage: firebase.storage.Storage;
  constructor() {
    this.app = firebase.initializeApp(Config.firebase);
    this.database = this.app.database();
    this.storage = this.app.storage();
  }
}

let api: apiBase;

const init = () => {
  if (!api) {
    api = new apiBase();
  }
  return api;
};

const writePost = (postData: object) => {
  const postId = api.database.ref("posts").push().key;
  if (!postId) {
    throw new Error("post id is empty");
  }
  const wrappedPostData = {
    ...postData,
    modifiedTime: new Date().toISOString(),
    userAgent: navigator.userAgent,
    id: postId
  };
  return api.database
    .ref("posts")
    .child(postId)
    .set(wrappedPostData);
};

const getPost = (callback: Function) => {
  const postRef = api.database.ref("posts");
  postRef.on("child_added", (data: firebase.database.DataSnapshot) => {
    callback(data.val());
  });
};

const listAllImages = () => {
  return api.storage.ref(Config.img.namespace).listAll();
};

const uploadImage = (imgName: string, image: Blob) => {
  return api.storage
    .ref(Config.img.namespace)
    .child(imgName)
    .put(image);
};

export default {
  init,
  writePost,
  getPost,
  listAllImages,
  uploadImage
};
