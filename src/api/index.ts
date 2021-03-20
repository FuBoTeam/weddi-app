import firebase from 'firebase/app';

import configService from '../services/configService';

export const writePost = (database: firebase.database.Database) => (postData: object): Promise<object> => {
  const postId = database.ref('posts').push().key;
  if (!postId) {
    throw new Error('post id is empty');
  }
  const wrappedPostData = {
    ...postData,
    modifiedTime: new Date().toISOString(),
    userAgent: navigator.userAgent,
    id: postId
  };
  return database
    .ref('posts')
    .child(postId)
    .set(wrappedPostData);
};

export const onNewPost = (database: firebase.database.Database) => (callback: Function): void => {
  const postRef = database.ref('posts');
  postRef.on('child_added', (data: firebase.database.DataSnapshot) => {
    callback(data.val());
  });
};

export const listAllImages = (storage: firebase.storage.Storage) => (): Promise<firebase.storage.ListResult> => {
  return storage.ref(configService.config.img.namespace).listAll();
};

export const uploadImage = (storage: firebase.storage.Storage) => (imgName: string, image: Blob): firebase.storage.UploadTask => {
  return storage
    .ref(configService.config.img.namespace)
    .child('public_upload')
    .child(imgName)
    .put(image);
};
