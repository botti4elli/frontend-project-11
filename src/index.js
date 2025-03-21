import onChange from 'on-change';
import i18next from 'i18next';
import initI18n from './locales.js';
import validate from './validate.js';
import renderView from './view.js';

const form = document.getElementById('rss-form');
const input = document.getElementById('url-input');

const state = onChange(
  {
    feeds: new Set(),
    error: null,
    success: false,
  },
  () => {
    renderView(state, input);
  },
);

initI18n().then(() => {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const url = input.value.trim();

    validate(url, state.feeds)
      .then(() => {
        state.error = null;
        state.success = true;
        state.feeds.add(url);
        form.reset();
        input.focus();
      })
      .catch((err) => {
        state.error = err.code ? i18next.t(err.code) : err.message;
        state.success = false;
      });
  });

  input.addEventListener('input', () => {
    state.error = null;
    state.success = false;
  });
});
