import * as firebase from 'firebase';

const config = {
  apiKey: "AIzaSyBBySVkkck8ef9OyAcfjv9_IIe6oRFYIsA",
  authDomain: "my-project-wedding-iota-app.firebaseapp.com",
  databaseURL: "https://my-project-wedding-iota-app.firebaseio.com",
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
  console.log(postId, typeof postId);
  const wrappedPostData = {
    ...postData,
    modifiedTime: new Date().toISOString(),
    id: postId,
  };
  return api.getDB().ref(`posts/${postId}`).set(wrappedPostData);
};

export default {
  init,
  writePost,
};
