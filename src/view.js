import onChange from 'on-change';
import i18next from 'i18next';
import { Modal } from 'bootstrap';

const renderFeedback = (element, input, { type, message }) => {
  input.classList.toggle('is-invalid', type === 'error');

  if (message) {
    // eslint-disable-next-line no-param-reassign
    element.textContent = message;
    element.classList.remove('d-none');
  } else {
    element.classList.add('d-none');
  }

  element.classList.toggle('text-danger', type === 'error');
  element.classList.toggle('text-success', type === 'success');
};

const renderFeeds = (container, feeds) => {
  // eslint-disable-next-line no-param-reassign
  container.innerHTML = '';

  if (!feeds.length) {
    container.classList.add('d-none');
    return;
  }

  container.classList.remove('d-none');
  const feedsTitle = document.createElement('h2');
  feedsTitle.className = 'mb-4';
  feedsTitle.textContent = 'Фиды';

  const list = document.createElement('ul');
  list.className = 'list-group';

  feeds.forEach(({ title, description }) => {
    const item = document.createElement('li');
    item.className = 'list-group-item border-0';
    item.innerHTML = `<h3 class="h6">${title}</h3><p class="m-0 small text-muted">${description}</p>`;
    list.appendChild(item);
  });

  container.append(feedsTitle, list);
};

const renderPosts = (container, posts, readPosts, modalElements) => {
  const list = container.querySelector('ul') || document.createElement('ul');
  list.className = 'list-group';

  const existingPostIds = new Set([...list.children].map((item) => item.dataset.id));
  const fragment = document.createDocumentFragment();

  posts.forEach((post) => {
    if (existingPostIds.has(post.id)) return;

    const item = document.createElement('li');
    item.className = 'list-group-item d-flex justify-content-between align-items-start border-0';
    item.dataset.id = post.id;

    const link = document.createElement('a');
    link.href = post.link;
    link.textContent = post.title;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.className = readPosts.has(post.id) ? 'fw-normal text-secondary' : 'fw-bold';

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'btn btn-outline-primary btn-sm';
    button.textContent = i18next.t('view');
    button.dataset.id = post.id;

    button.addEventListener('click', () => {
      readPosts.add(post.id);
      link.classList.remove('fw-bold');
      link.classList.add('fw-normal', 'text-secondary');

      // eslint-disable-next-line no-param-reassign
      modalElements.title.textContent = post.title;
      // eslint-disable-next-line no-param-reassign
      modalElements.body.textContent = post.description;
      // eslint-disable-next-line no-param-reassign
      modalElements.fullArticle.href = post.link;

      new Modal(modalElements.modal).show();
    });

    item.append(link, button);
    fragment.prepend(item);
  });

  list.prepend(fragment);
  if (!container.contains(list)) {
    container.appendChild(list);
  }
};

const initView = (state, input) => {
  const feedbackEl = document.querySelector('.feedback');
  const feedsContainer = document.querySelector('.feeds');
  const postsContainer = document.querySelector('.posts');
  const modalElements = {
    modal: document.getElementById('modal'),
    title: document.querySelector('.modal-title'),
    body: document.querySelector('.modal-body'),
    fullArticle: document.querySelector('.full-article'),
  };

  return onChange(state, (path) => {
    if (path === 'error' || path === 'success') {
      renderFeedback(feedbackEl, input, {
        type: path,
        message: state[path] ? i18next.t(state[path]) : '',
      });
    }

    if (path.startsWith('feeds')) {
      renderFeeds(feedsContainer, Object.values(state.feeds.byId));
    }

    if (path.startsWith('posts')) {
      // eslint-disable-next-line max-len
      renderPosts(postsContainer, Object.values(state.posts.byId), state.ui.readPosts, modalElements);
    }
  });
};

export default initView;
