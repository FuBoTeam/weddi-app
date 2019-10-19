import * as firebase from 'firebase/app';
import 'firebase/database';

import Configs from '../configs';

class apiBase {
  constructor () {
    this.app = firebase.initializeApp(Configs.getDBConfig());
    this.firebase = firebase;
    this.database = firebase.database();
  }
  getDB () {
    return this.database;
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
  const postId = api.getDB().ref().child('posts').push().key;
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

export default {
  init,
  writePost,
  getPost,
};
