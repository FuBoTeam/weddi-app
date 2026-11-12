/*
 * Capture-only stand-in for src/api/index.ts.
 *
 * capture.sh copies the app into a temp directory and swaps this file in for
 * src/api/index.ts there. It is never imported by the real app. It keeps the
 * same exports, never touches Firebase, and serves obvious sample greetings
 * plus photos that capture.sh downloaded read-only from the /test event's
 * image bucket into the temp build's public/sample-img/ folder.
 */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { combinationList } from '../utils/random';
// Written by capture.sh next to this file: the downloaded image file names.
import { SAMPLE_IMAGES } from './sampleImages';

const IMAGES: string[] = SAMPLE_IMAGES.map(
  name => `${process.env.PUBLIC_URL}/sample-img/${name}`,
);

const SAMPLE_GREETINGS: Array<[string, string]> = [
  ['Sample Guest', 'Congratulations to you both! Wishing you a lifetime of laughter and adventures together. (sample greeting)'],
  ['Guest A', 'So happy for you two! (sample)'],
  ['Guest B', 'Cheers to love! (sample)'],
  ['Guest C', 'Best wishes! (sample)'],
  ['Guest D', 'Congrats! (sample)'],
  ['Guest E', 'Have fun! (sample)'],
  ['Guest F', 'Love you both! (sample)'],
  ['Guest G', 'Hooray! (sample)'],
  ['Guest H', 'Many happy years! (sample)'],
  ['Guest I', 'Yay! (sample)'],
  ['Guest J', 'Congratulations! (sample)'],
  ['Guest K', 'Wonderful day! (sample)'],
  ['Guest L', 'All the best! (sample)'],
  ['Guest M', 'Cheers! (sample)'],
  ['Guest N', 'Much love! (sample)'],
  ['Guest O', 'Happy wedding! (sample)'],
];

const POSTS: {[id: string]: WeddiApp.Post.Data} = {};
SAMPLE_GREETINGS.forEach(([name, greetings], i) => {
  const id = `sample-${String(i).padStart(2, '0')}`;
  POSTS[id] = {
    id,
    name,
    greetings,
    imgUrl: IMAGES[i % IMAGES.length],
    joinedGame: true,
    modifiedTime: new Date(2020, 0, 1, 12, i).toISOString(),
    userAgent: 'sample',
  };
});

export const listPosts = (_database: unknown, _options?: unknown) => Promise.resolve({ ...POSTS });

export const writePost = (_database: unknown, _postData: unknown): Promise<void> =>
  Promise.reject(new Error('capture stub: writes are disabled'));

export const onNewPost = (_database: unknown, _callback: unknown): void => undefined;

export const listImageRefs = (_storage: unknown, _options?: unknown) => Promise.resolve([]);

export const listRandomKImages = async (_storage: unknown, k: number, _options?: unknown): Promise<string[]> =>
  combinationList(IMAGES, Math.min(k, IMAGES.length));

export const uploadImage = (_storage: unknown, _imgName: string, _image: Blob): Promise<string> =>
  Promise.reject(new Error('capture stub: uploads are disabled'));
