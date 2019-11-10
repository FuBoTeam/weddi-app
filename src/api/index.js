import * as firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/storage';

import Configs from '../configs';

class apiBase {
  constructor () {
    this.app = firebase.initializeApp(Configs.getFirebaseConfig());
    this.database = this.app.database();
    this.storage = this.app.storage();
  }

  getDB () {
    return this.database;
  }

  getStorage () {
    return this.storage;
  }
};

let api;

const init = () => {
  if (!api) {
    api = new apiBase();
  }
  return api;
};

const writePost = (postData) => {
  const postId = api.getDB().ref('posts').push().key;
  const wrappedPostData = {
    ...postData,
    modifiedTime: new Date().toISOString(),
    userAgent: navigator.userAgent,
    id: postId,
  };
  return api.getDB().ref(`posts/${postId}`).set(wrappedPostData);
};

const getPost = (callback) => {
  const postRef = api.getDB().ref('posts');
  postRef.on('child_added', (data) => {
    callback(data.val());
  });
};

const listAllImages = () => {
  return api.getStorage().ref(Configs.getImgConfig().namespace).listAll();
}

const uploadImage = (imgName, image) => {
  return api.getStorage().ref(Configs.getImgConfig().namespace).child(imgName).put(image);
}

export default {
  init,
  writePost,
  getPost,
  listAllImages,
  uploadImage,
};
