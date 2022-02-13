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
  StorageReference,
} from 'firebase/storage';

import configService from '../services/configService';
import { combinationList } from '../utils/random';

interface ListPostsOptions {
  readonly joinedGame?: boolean;
}

export const listPosts = (
  database: Database,
  options: ListPostsOptions = { joinedGame: false },
): Promise<{[id: string]: WeddiApp.Post.Data} | null> => {
  let postRef: Query = databaseRef(database, `${configService.config.post.namespace}/posts`);
  const joinedGame = options.joinedGame ?? false;
  if (joinedGame) {
    postRef = query(postRef, orderByChild('joinedGame'), equalTo(true));
  }
  return new Promise(resolve =>
    onValue(postRef, (snapshot => {
      resolve(snapshot.val());
    }), { onlyOnce: true }));
};

export const writePost = (database: Database, postData: WeddiApp.Post.UserInput): Promise<void> => {
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
  return set(databaseRef(database, `${configService.config.post.namespace}/posts/${postId}`), wrappedPostData);
};

export const onNewPost = (database: Database, callback: (post: WeddiApp.Post.Data) => any): void => {
  const postRef = databaseRef(database, `${configService.config.post.namespace}/posts`);
  onChildAdded(postRef, (snapshot => {
    callback(snapshot.val());
  }));
};

interface ListImagesOptions {
  readonly size?: 'small' | 'regular';
}

export const listImageRefs = (storage: FirebaseStorage, options: ListImagesOptions = { size: 'small' }): Promise<StorageReference[]> => {
  const size = options.size ?? 'small';
  return listAll(storageRef(storage, `${configService.config.img.namespace}/${size}`))
    .then(listResult => listResult.items);
};

export const listRandomKImages = async (storage: FirebaseStorage, k: number, options?: ListImagesOptions): Promise<string[]> => {
  const imageRefs = await listImageRefs(storage, options);
  const kImageRefs = combinationList(imageRefs, k);
  return Promise.all(kImageRefs.map(getDownloadURL));
};

export const uploadImage = (storage: FirebaseStorage, imgName: string, image: Blob): Promise<string> => {
  return uploadBytes(storageRef(storage, `${configService.config.img.namespace}/public_upload/${imgName}`), image)
    .then(result => getDownloadURL(result.ref));
};
