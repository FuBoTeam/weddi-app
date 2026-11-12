export type PostDictionary = Record<string, WeddiApp.Post.Data>;

export interface EventData {
  settings?: { approvalEnabled?: boolean };
  posts?: PostDictionary;
}

export interface ListPostsOptions {
  readonly joinedGame?: boolean;
}

export const visiblePosts = (event: EventData, options: ListPostsOptions = {}): PostDictionary | null => {
  const posts: PostDictionary = {};
  Object.entries(event.posts || {}).forEach(([id, post]) => {
    const approved = post.status === undefined || post.status === 'approved';
    if ((!event.settings?.approvalEnabled || approved) && (!options.joinedGame || post.joinedGame)) {
      posts[id] = { ...post, id };
    }
  });
  return Object.keys(posts).length ? posts : null;
};
