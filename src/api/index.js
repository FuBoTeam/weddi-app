import * as firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/storage';

import Configs from '../configs';

class apiBase {
  constructor () {
    this.app = firebase.initializeApp(Configs.firebase);
    this.database = this.app.database();
    this.storage = this.app.storage();
  }
}

let api;

const init = () => {
  if (!api) {
    api = new apiBase();
  }
  return api;
};

const writePost = (postData) => {
  const postId = api.database.ref('posts').push().key;
  const wrappedPostData = {
    ...postData,
    modifiedTime: new Date().toISOString(),
    userAgent: navigator.userAgent,
    id: postId,
  };
  return api.database.ref('posts').child(postId).set(wrappedPostData);
};

const getPost = (callback) => {
  const postRef = api.database.ref('posts');
  postRef.on('child_added', (data) => {
    callback(data.val());
  });
};

const listAllImages = () => {
  return api.storage.ref(Configs.img.namespace).listAll();
}

const uploadImage = (imgName, image) => {
  return api.storage.ref(Configs.img.namespace).child(imgName).put(image);
}

export default {
  init,
  writePost,
  getPost,
  listAllImages,
  uploadImage,
};
