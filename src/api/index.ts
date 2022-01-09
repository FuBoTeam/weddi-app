import {
  Database, Query,
  ref as databaseRef,
  set,
  push,
  query,
  orderByChild,
  equalTo,
  onValue,
  onChildAdded,
} from 'firebase/database';
import {
  FirebaseStorage,
  ref as storageRef,
  uploadBytes,
  listAll,
  getDownloadURL,
} from 'firebase/storage';

import configService from '../services/configService';

export const listPosts = (database: Database) => (joinedGame = false): Promise<{[id: string]: WeddiApp.Post.Data} | null> => {
  let postRef: Query = databaseRef(database, `${configService.config.post.namespace}/posts`);
  if (joinedGame) {
    postRef = query(postRef, orderByChild('joinedGame'), equalTo(true));
  }
  return new Promise(resolve =>
    onValue(postRef, (snapshot => {
      resolve(snapshot.val());
    }), { onlyOnce: true }));
};

export const writePost = (database: Database) => (postData: WeddiApp.Post.UserInput): Promise<void> => {
  const postId = push(databaseRef(database, `${configService.config.post.namespace}/posts`)).key;
  if (!postId) {
    throw new Error('post id is empty');
  }
  const wrappedPostData: WeddiApp.Post.Data = {
    ...postData,
    modifiedTime: new Date().toISOString(),
    userAgent: navigator.userAgent,
    id: postId
  };
  return set(databaseRef(database, `${configService.config.post.namespace}/posts/${postId}}`), wrappedPostData);
};

export const onNewPost = (database: Database) => (callback: (post: WeddiApp.Post.Data) => any): void => {
  const postRef = databaseRef(database, `${configService.config.post.namespace}/posts`);
  onChildAdded(postRef, (snapshot => {
    callback(snapshot.val());
  }));
};

export const listAllImages = (storage: FirebaseStorage) => (size: 'small' | 'regular' = 'small'): Promise<string[]> => {
  return listAll(storageRef(storage, `${configService.config.img.namespace}/${size}`))
    .then(listResult => Promise.all(listResult.items.map(getDownloadURL)));
};

export const uploadImage = (storage: FirebaseStorage) => (imgName: string, image: Blob): Promise<string> => {
  return uploadBytes(storageRef(storage, `${configService.config.img.namespace}/public_upload/${imgName}`), image)
    .then(result => getDownloadURL(result.ref));
};
