import {
  Database,
  ref as databaseRef,
  set,
  push,
  onValue,
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
import { EventData, PostDictionary, ListPostsOptions, visiblePosts } from './postVisibility';

const eventRef = (database: Database) => databaseRef(database, configService.config.post.namespace);

const readEvent = (database: Database): Promise<EventData> => new Promise((resolve, reject) =>
  onValue(eventRef(database), snapshot => resolve(snapshot.val() || {}), reject, { onlyOnce: true }));

export const subscribeEvent = (
  database: Database,
  callback: (event: EventData) => void,
  onError?: (error: Error) => void,
): (() => void) => onValue(eventRef(database), snapshot => callback(snapshot.val() || {}), onError);

export const subscribePosts = (
  database: Database,
  callback: (posts: PostDictionary | null) => void,
  options: ListPostsOptions = {},
  onError?: (error: Error) => void,
): (() => void) => {
  let previous: string | undefined;
  return subscribeEvent(database, event => {
    const posts = visiblePosts(event, options);
    const signature = JSON.stringify(posts);
    if (signature !== previous) {
      previous = signature;
      callback(posts);
    }
  }, onError);
};

export const setApprovalEnabled = (database: Database, enabled: boolean): Promise<void> =>
  set(databaseRef(database, `${configService.config.post.namespace}/settings/approvalEnabled`), enabled);

export const approvePost = (database: Database, postId: string): Promise<void> =>
  set(databaseRef(database, `${configService.config.post.namespace}/posts/${postId}/status`), 'approved');

export const listPosts = (
  database: Database,
  options: ListPostsOptions = { joinedGame: false },
): Promise<PostDictionary | null> => readEvent(database).then(event => visiblePosts(event, options));

export const writePost = async (database: Database, postData: WeddiApp.Post.UserInput): Promise<void> => {
  const approvalEnabled = await new Promise<boolean>((resolve, reject) =>
    onValue(databaseRef(database, `${configService.config.post.namespace}/settings/approvalEnabled`),
      snapshot => resolve(snapshot.val() === true), reject, { onlyOnce: true }));
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
  if (approvalEnabled) {
    wrappedPostData.status = 'pending';
  }
  return set(databaseRef(database, `${configService.config.post.namespace}/posts/${postId}`), wrappedPostData);
};

export const onNewPost = (database: Database, callback: (post: WeddiApp.Post.Data) => void): (() => void) => {
  let previous: PostDictionary = {};
  return subscribePosts(database, posts => {
    Object.keys(posts || {}).forEach(id => {
      if (!previous[id] && posts) callback(posts[id]);
    });
    previous = posts || {};
  });
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
