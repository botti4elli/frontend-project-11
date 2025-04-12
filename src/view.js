import onChange from 'on-change';
import i18next from 'i18next';
import { Modal } from 'bootstrap';

const renderFeedback = (elements, feedProcess) => {
  const { status, message, error } = feedProcess;

  elements.input.classList.toggle('is-invalid', status === 'error');

  if (status === 'idle' || !(message || error)) {
    elements.feedback.classList.add('d-none');
    return;
  }

  // eslint-disable-next-line no-param-reassign
  elements.feedback.textContent = i18next.t(error || message);
  elements.feedback.classList.remove('d-none');
  elements.feedback.classList.toggle('text-danger', status === 'error');
  elements.feedback.classList.toggle('text-success', status === 'success');
  elements.feedback.classList.toggle('text-info', status === 'loading');
};

const renderFeeds = (container, feeds) => {
  // eslint-disable-next-line no-param-reassign
  container.innerHTML = '';
  if (!feeds.length) {
    container.classList.add('d-none');
    return;
  }

  container.classList.remove('d-none');
  const title = document.createElement('h2');
  title.className = 'mb-4';
  title.textContent = i18next.t('feeds_title');

  const list = document.createElement('ul');
  list.className = 'list-group';

  feeds.forEach((feed) => {
    const item = document.createElement('li');
    item.className = 'list-group-item border-0';
    item.innerHTML = `<h3 class="h6">${feed.title}</h3><p class="m-0 small text-muted">${feed.description}</p>`;
    list.appendChild(item);
  });

  container.append(title, list);
};

const renderPosts = (container, posts, readPosts) => {
  // eslint-disable-next-line no-param-reassign
  container.innerHTML = '';
  if (!posts.length) {
    container.classList.add('d-none');
    return;
  }

  container.classList.remove('d-none');
  const title = document.createElement('h2');
  title.className = 'mb-4';
  title.textContent = i18next.t('posts_title');

  const list = document.createElement('ul');
  list.className = 'list-group';

  posts.forEach((post) => {
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

    item.append(link, button);
    list.appendChild(item);
  });

  container.append(title, list);
};

const renderModal = (modalElements, modalData) => {
  if (!modalData) return;

  // eslint-disable-next-line no-param-reassign
  modalElements.title.textContent = modalData.title;
  // eslint-disable-next-line no-param-reassign
  modalElements.body.textContent = modalData.body;
  // eslint-disable-next-line no-param-reassign
  modalElements.link.href = modalData.link;
  new Modal(modalElements.modal).show();
};

const initView = (state, elements) => {
  const modalElements = {
    modal: document.getElementById('modal'),
    title: document.querySelector('.modal-title'),
    body: document.querySelector('.modal-body'),
    link: document.querySelector('.full-article'),
  };

  return onChange(state, (path) => {
    if (path === 'ui.feedProcess') {
      renderFeedback(elements, state.ui.feedProcess);
    }

    if (path.startsWith('feeds')) {
      const feeds = state.feeds.allIds.map((id) => state.feeds.byId[id]);
      renderFeeds(elements.feedsContainer, feeds);
    }

    if (path.startsWith('posts') || path === 'ui.readPosts') {
      const posts = state.posts.allIds.map((id) => state.posts.byId[id]);
      renderPosts(elements.postsContainer, posts, state.ui.readPosts);
    }

    if (path === 'ui.modal') {
      renderModal(modalElements, state.ui.modal);
    }
  });
};

export default initView;
