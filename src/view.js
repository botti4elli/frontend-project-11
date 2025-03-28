import onChange from 'on-change';
import i18next from 'i18next';

import { translationKeys } from './locales.js';

const renderFeedback = (element, input, { type, message }) => {
  input.classList.toggle('is-invalid', type === 'error');

  if (message) {
    // eslint-disable-next-line no-param-reassign
    element.textContent = message;
    element.classList.remove('d-none');
    element.classList.add('d-block');
  } else {
    element.classList.add('d-none');
    element.classList.remove('d-block');
  }

  element.classList.toggle('text-danger', type === 'error');
  element.classList.toggle('text-success', type === 'success');
};

const renderFeeds = (container, feeds) => {
  // eslint-disable-next-line no-param-reassign
  container.innerHTML = '';

  if (!feeds || feeds.length === 0) {
    container.classList.add('d-none');
    return;
  }

  const title = document.createElement('h2');
  title.className = 'mb-4';
  title.textContent = 'Фиды';

  const list = document.createElement('ul');
  list.className = 'list-group';

  feeds.forEach((feed) => {
    const item = document.createElement('li');
    item.className = 'list-group-item border-0';
    item.innerHTML = `
      <h3 class="h6">${feed.title}</h3>
      <p class="m-0 small text-muted">${feed.description}</p>
    `;
    list.appendChild(item);
  });

  container.append(title, list);
  container.classList.remove('d-none');
};

const renderPosts = (container, posts) => {
  // eslint-disable-next-line no-param-reassign
  container.innerHTML = '';

  if (!posts || posts.length === 0) {
    container.classList.add('d-none');
    return;
  }

  const title = document.createElement('h2');
  title.className = 'mb-4';
  title.textContent = 'Посты';

  const list = document.createElement('ul');
  list.className = 'list-group';

  posts.forEach((post) => {
    const item = document.createElement('li');
    item.className = 'list-group-item d-flex justify-content-between align-items-start border-0';
    item.innerHTML = `
      <a href="${post.link}" class="fw-bold" target="_blank" rel="noopener noreferrer">
        ${post.title}
      </a>
      <button type="button" class="btn btn-outline-primary btn-sm">Просмотр</button>
    `;
    list.appendChild(item);
  });

  container.append(title, list);
  container.classList.remove('d-none');
};

const initView = (state, input) => {
  const feedbackEl = document.querySelector('.feedback');
  const feedsContainer = document.querySelector('.feeds');
  const postsContainer = document.querySelector('.posts');

  if (!feedsContainer || !postsContainer || !feedbackEl) {
    console.error('Элементы .feeds или .posts не найдены в DOM');
    return state;
  }

  return onChange(state, (path, value) => {
    console.log('State changed:', path, value);

    switch (path) {
      case 'error':
        renderFeedback(feedbackEl, input, {
          type: 'error',
          message: value ? i18next.t(value) : '',
        });
        break;

      case 'success':
        renderFeedback(feedbackEl, input, {
          type: 'success',
          message: value ? i18next.t(translationKeys.RSS_ADDED) : '',
        });
        break;

      case 'feeds.allIds':
        renderFeeds(feedsContainer, state.feeds.allIds.map((id) => state.feeds.byId[id]));
        break;

      case 'posts.allIds':
        renderPosts(postsContainer, state.posts.allIds.map((id) => state.posts.byId[id]));
        break;

      default:
        break;
    }
  });
};

export default initView;
