import firebase from 'firebase/app';

import configService from '../services/configService';

export const listPosts = (database: firebase.database.Database) => (): Promise<{[id: string]: WeddiApp.Post.Data}> => {
  return database
    .ref(`${configService.config.post.namespace}/posts`)
    // .orderByChild('joinedGames').equalTo(true)
    .once('value')
    .then(snapshot => snapshot.val());
};

export const writePost = (database: firebase.database.Database) => (postData: WeddiApp.Post.UserInput): Promise<WeddiApp.Post.Data> => {
  const postId = database.ref(`${configService.config.post.namespace}/posts`).push().key;
  if (!postId) {
    throw new Error('post id is empty');
  }
  const wrappedPostData: WeddiApp.Post.Data = {
    ...postData,
    modifiedTime: new Date().toISOString(),
    userAgent: navigator.userAgent,
    id: postId
  };
  return database
    .ref(`${configService.config.post.namespace}/posts`)
    .child(postId)
    .set(wrappedPostData);
};

export const onNewPost = (database: firebase.database.Database) => (callback: (post: WeddiApp.Post.Data) => any): void => {
  const postRef = database.ref(`${configService.config.post.namespace}/posts`);
  postRef.on('child_added', (data: firebase.database.DataSnapshot) => {
    callback(data.val());
  });
};

export const listAllImages = (storage: firebase.storage.Storage) => (size: 'small' | 'regular' = 'small') => {
  return storage.ref(configService.config.img.namespace).child(size).listAll()
    .then(listResult => Promise.all(listResult.items.map(item => item.getDownloadURL())));
};

export const uploadImage = (storage: firebase.storage.Storage) => (imgName: string, image: Blob): firebase.storage.UploadTask => {
  return storage
    .ref(configService.config.img.namespace)
    .child('public_upload')
    .child(imgName)
    .put(image);
};
