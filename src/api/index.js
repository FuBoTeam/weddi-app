import * as firebase from 'firebase/app';
import 'firebase/database';

const config = {
  apiKey: "AIzaSyBBySVkkck8ef9OyAcfjv9_IIe6oRFYIsA",
  authDomain: "my-project-wedding-iota-app.firebaseapp.com",
  databaseURL: "https://yych-wedding-app.firebaseio.com/",
  projectId: "my-project-wedding-iota-app",
  storageBucket: "my-project-wedding-iota-app.appspot.com",
  messagingSenderId: "640957122856"
};

class apiBase {
  constructor () {
    this.app = firebase.initializeApp(config);
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
