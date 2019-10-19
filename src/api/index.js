import * as firebase from 'firebase/app';
import 'firebase/database';

const CHYY_CONFIG = {
  apiKey: "AIzaSyD_1irJWOgT9x5fvmbXJm0fRRRZ8DNUfpU",
  authDomain: "weddi-app.firebaseapp.com",
  databaseURL: "https://weddi-app.firebaseio.com/",
  projectId: "weddi-app",
  storageBucket: "weddi-app.appspot.com",
  messagingSenderId: "324415165027",
  appId: "1:324415165027:web:76b8291835ef32c5c75e56"
};

const TEST_CONFIG = {
  apiKey: "AIzaSyD_1irJWOgT9x5fvmbXJm0fRRRZ8DNUfpU",
  authDomain: "weddi-app.firebaseapp.com",
  databaseURL: "https://weddi-app-test.firebaseio.com/",
  projectId: "weddi-app",
  storageBucket: "weddi-app.appspot.com",
  messagingSenderId: "324415165027",
  appId: "1:324415165027:web:76b8291835ef32c5c75e56"
};

const getDBConfigById = (gnbId) => {
  switch(gnbId) {
  case 'chyy':
    return CHYY_CONFIG;
  case 'tlty':
    return TEST_CONFIG;
  default:
    return TEST_CONFIG;
  }
}

class apiBase {
  constructor (gnbId) {
    this.app = firebase.initializeApp(getDBConfigById(gnbId));
    this.firebase = firebase;
    this.database = firebase.database();
  }
  getDB () {
    return this.database;
  }
};

let api;

const init = (gnbId) => {
  if (!api) {
    api = new apiBase(gnbId);
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
