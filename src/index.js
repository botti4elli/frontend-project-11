import validate from './validate.js';
import initView from './view.js';
import fetchRSS from './rssLoader.js';
import initI18n from './locales.js';

const CHECK_INTERVAL = 60000;

const createState = () => ({
  feeds: { byId: {}, allIds: [] },
  posts: { byId: {}, allIds: [] },
  urls: new Set(),
  error: null,
  success: null,
  ui: {
    readPosts: new Set(),
    activePostId: null,
  },
});

const checkForUpdates = (state) => {
  if (state.urls.size === 0) return;

  const urls = [...state.urls];

  Promise.allSettled(urls.map((url) => fetchRSS(url)))
    .then((responses) => {
      responses.forEach(({ status, value }) => {
        if (status !== 'fulfilled' || !value) return;

        const { posts } = value;
        const existingLinks = new Set(state.posts.allIds.map((id) => state.posts.byId[id].link));
        const newPosts = posts.filter((post) => !existingLinks.has(post.link));

        if (newPosts.length > 0) {
          state.posts.allIds.unshift(...newPosts.map((post) => post.id));
          newPosts.forEach((post) => {
            // eslint-disable-next-line no-param-reassign
            state.posts.byId[post.id] = post;
          });
        }
      });
    })
    .finally(() => {
      setTimeout(() => checkForUpdates(state), CHECK_INTERVAL);
    });
};

initI18n().then(() => {
  const form = document.getElementById('rss-form');
  const input = document.getElementById('url-input');
  const state = createState();
  const watchedState = initView(state, input);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const url = input.value.trim();

    watchedState.error = null;
    watchedState.success = null;

    validate(url, watchedState.urls)
      .then(() => fetchRSS(url))
      .then(({ feed, posts }) => {
        watchedState.feeds.byId[feed.id] = feed;
        watchedState.feeds.allIds.push(feed.id);

        watchedState.posts.allIds.unshift(...posts.map((post) => post.id));
        posts.forEach((post) => {
          watchedState.posts.byId[post.id] = post;
        });

        watchedState.success = 'rss_added';
        watchedState.urls.add(url);
        input.value = '';

        if (watchedState.urls.size === 1) {
          checkForUpdates(watchedState);
        }
      })
      .catch((err) => {
        watchedState.error = err.message;
      })
      .finally(() => {
        input.focus();
      });
  });
});
