import validate from './validate.js';
import initView from './view.js';
import fetchRSS from './rssLoader.js';
import initI18n from './locales.js';

initI18n().then(() => {
  const form = document.getElementById('rss-form');
  const input = document.getElementById('url-input');

  const initialState = {
    feeds: { byId: {}, allIds: [] },
    posts: { byId: {}, allIds: [] },
    urls: new Set(),
    error: null,
    success: null,
  };

  const state = initView(initialState, input);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const url = input.value.trim();

    state.error = null;
    state.success = null;

    validate(url, state.urls)
      .then(() => fetchRSS(url))
      .then(({ feed, posts }) => {
        state.feeds.byId[feed.id] = feed;
        state.feeds.allIds.unshift(feed.id);

        posts.forEach((post) => {
          state.posts.byId[post.id] = post;
          state.posts.allIds.unshift(post.id);
        });

        state.success = 'rss_added';
        state.urls.add(url);
        input.value = '';
      })
      .catch((err) => {
        state.error = err.message;
      })
      .finally(() => {
        input.focus();
      });
  });
});
