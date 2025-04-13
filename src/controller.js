import validate from './validate.js';
import fetchRSS from './rssLoader.js';

export const handleFormSubmit = (state, elements) => (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const url = formData.get('url').trim();

  // eslint-disable-next-line no-param-reassign
  state.ui.feedProcess = {
    status: 'loading',
    message: 'form_loading',
    error: null,
  };

  validate(url, state.urls)
    .then(() => fetchRSS(url))
    .then(({ feed, posts }) => {
      // eslint-disable-next-line no-param-reassign
      state.feeds.byId[feed.id] = feed;
      state.feeds.allIds.push(feed.id);

      posts.forEach((post) => {
        // eslint-disable-next-line no-param-reassign
        state.posts.byId[post.id] = post;
        state.posts.allIds.unshift(post.id);
      });

      // eslint-disable-next-line no-param-reassign
      state.ui.feedProcess = {
        status: 'success',
        message: 'rss_added',
        error: null,
      };

      state.urls.add(url);
      e.target.reset();
    })
    .catch((err) => {
      // eslint-disable-next-line no-param-reassign
      state.ui.feedProcess = {
        status: 'error',
        message: null,
        error: err.message,
      };
    })
    .finally(() => {
      elements.input.focus();
    });
};

export const handlePostClick = (state) => (e) => {
  const { target } = e;
  if (!(target instanceof Element)) return;

  const button = target.closest('button[data-id]');
  if (!button) return;

  const postId = button.dataset.id;
  const post = state.posts.byId[postId];
  if (!post) return;

  state.ui.readPosts.add(postId);
  // eslint-disable-next-line no-param-reassign
  state.ui.modal = {
    title: post.title,
    body: post.description,
    link: post.link,
  };
};
