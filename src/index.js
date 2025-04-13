import initI18n from './locales.js';
import initView from './view.js';
import fetchRSS from './rssLoader.js';
import { createState, checkForUpdates } from './model.js';
import { handleFormSubmit, handlePostClick } from './controller.js';

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

  checkForUpdates(watchedState, fetchRSS);

  elements.form.addEventListener('submit', handleFormSubmit(watchedState, elements));
  elements.postsContainer.addEventListener('click', handlePostClick(watchedState));
});
