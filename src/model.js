const CHECK_INTERVAL = 60000;

export const createState = () => ({
  feeds: { byId: {}, allIds: [] },
  posts: { byId: {}, allIds: [] },
  urls: new Set(),
  ui: {
    readPosts: new Set(),
    feedProcess: {
      status: 'idle',
      message: null,
      error: null,
    },
    modal: null,
  },
});

export const checkForUpdates = (state, fetchRSS) => {
  if (state.urls.size > 0) {
    const urls = [...state.urls];
    Promise.allSettled(urls.map((url) => fetchRSS(url)))
      .then((results) => {
        results.forEach(({ status, value }) => {
          if (status !== 'fulfilled' || !value) return;

          const { posts } = value;
          const existingLinks = new Set(state.posts.allIds.map((id) => state.posts.byId[id].link));
          const newPosts = posts.filter((post) => !existingLinks.has(post.link));

          newPosts.forEach((post) => {
            // eslint-disable-next-line no-param-reassign
            state.posts.byId[post.id] = post;
            state.posts.allIds.unshift(post.id);
          });
        });
      })
      .catch((err) => {
        console.error('Update check failed:', err);
      });
  }

  setTimeout(() => checkForUpdates(state, fetchRSS), CHECK_INTERVAL);
};
