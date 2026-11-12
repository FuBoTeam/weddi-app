export enum Stage {
  Init,
  Loaded,
  Start,
  Flipped,
  Stacked,
  Shuffling,
  Shuffled,
  Ready,
  Error,
}

export const isLotteryRoundActive = (stage: Stage): boolean =>
  stage !== Stage.Init && stage !== Stage.Loaded && stage !== Stage.Error;

export const applyEligiblePosts = (
  currentPosts: WeddiApp.Post.Data[],
  incoming: WeddiApp.Post.Data[],
  stage: Stage,
  revealedIds: Record<string, boolean>,
): {
  posts: WeddiApp.Post.Data[];
  stage: Stage;
  revealedIds: Record<string, boolean>;
  resetPresentation: boolean;
} => {
  if (!isLotteryRoundActive(stage)) {
    return {
      posts: incoming,
      stage: incoming.length ? Stage.Loaded : Stage.Error,
      revealedIds: { '*': true },
      resetPresentation: true,
    };
  }

  const incomingById: Record<string, WeddiApp.Post.Data> = {};
  incoming.forEach(post => { incomingById[post.id] = post; });
  const posts = currentPosts
    .filter(post => incomingById[post.id])
    .map(post => incomingById[post.id]);

  if (posts.length === 0) {
    return {
      posts,
      stage: Stage.Error,
      revealedIds: { '*': true },
      resetPresentation: true,
    };
  }

  const nextRevealed: Record<string, boolean> = { '*': !!revealedIds['*'] };
  if (!nextRevealed['*']) {
    currentPosts.forEach((post, index) => {
      if (!revealedIds[index]) {
        return;
      }
      const nextIndex = posts.findIndex(candidate => candidate.id === post.id);
      if (nextIndex >= 0) {
        nextRevealed[nextIndex] = true;
      }
    });
  }

  return { posts, stage, revealedIds: nextRevealed, resetPresentation: false };
};
