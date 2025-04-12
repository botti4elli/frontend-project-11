import validate from './validate.js';
import fetchRSS from './rssLoader.js';
import initI18n from './locales.js';
import initView from './view.js';

const CHECK_INTERVAL = 60000;

const createState = () => ({
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

const checkForUpdates = (state) => {
  if (state.urls.size > 0) {
    const urls = [...state.urls];
    Promise.allSettled(urls.map((url) => fetchRSS(url)))
      .then((results) => {
        results.forEach(({ status, value }) => {
          if (status !== 'fulfilled' || !value) return;

          const { posts } = value;
          const existingLinks = new Set(state.posts.allIds.map((id) => state.posts.byId[id].link));
          const newPosts = posts.filter((post) => !existingLinks.has(post.link));

          if (newPosts.length > 0) {
            newPosts.forEach((post) => {
              // eslint-disable-next-line no-param-reassign
              state.posts.byId[post.id] = post;
              state.posts.allIds.unshift(post.id);
            });
          }
        });
      })
      .catch((err) => {
        console.error('Update check failed:', err);
      });
  }
  setTimeout(() => checkForUpdates(state), CHECK_INTERVAL);
};

initI18n().then(() => {
  const elements = {
    form: document.getElementById('rss-form'),
    input: document.getElementById('url-input'),
    feedback: document.querySelector('.feedback'),
    feedsContainer: document.querySelector('.feeds'),
    postsContainer: document.querySelector('.posts'),
  };

  const state = createState();
  const watchedState = initView(state, elements);

  checkForUpdates(watchedState);

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const url = formData.get('url').trim();

    watchedState.ui.feedProcess = {
      status: 'loading',
      message: 'form_loading',
      error: null,
    };

    validate(url, watchedState.urls)
      .then(() => fetchRSS(url))
      .then(({ feed, posts }) => {
        watchedState.feeds.byId[feed.id] = feed;
        watchedState.feeds.allIds.push(feed.id);

        posts.forEach((post) => {
          watchedState.posts.byId[post.id] = post;
          watchedState.posts.allIds.unshift(post.id);
        });

        watchedState.ui.feedProcess = {
          status: 'success',
          message: 'rss_added',
          error: null,
        };

        watchedState.urls.add(url);
        e.target.reset();
      })
      .catch((err) => {
        watchedState.ui.feedProcess = {
          status: 'error',
          message: null,
          error: err.message,
        };
      })
      .finally(() => {
        elements.input.focus();
      });
  });

  elements.postsContainer.addEventListener('click', (e) => {
    const { target } = e;
    if (!(target instanceof Element)) return;

    const button = target.closest('button[data-id]');
    if (!button) return;

    const postId = button.dataset.id;
    const post = watchedState.posts.byId[postId];
    if (!post) return;

    watchedState.ui.readPosts.add(postId);
    watchedState.ui.modal = {
      title: post.title,
      body: post.description,
      link: post.link,
    };
  });
});
