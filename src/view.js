import i18next from 'i18next';

const translations = {
  rss_added: 'rss_added',
  url_invalid: 'url_invalid',
  url_required: 'url_required',
  rss_exists: 'rss_exists',
};

const renderError = (errorElement, input, errorKey) => {
  const newInput = input;
  const newErrorElement = errorElement;

  newInput.classList.add('is-invalid');
  newErrorElement.textContent = i18next.t(errorKey);
  newErrorElement.classList.remove('text-success');
  newErrorElement.classList.add('text-danger');
};

const renderSuccess = (errorElement, input) => {
  const newInput = input;
  const newErrorElement = errorElement;

  newInput.classList.remove('is-invalid');
  newErrorElement.textContent = i18next.t(translations.rss_added);
  newErrorElement.classList.remove('text-danger');
  newErrorElement.classList.add('text-success');
};

const clearFeedback = (errorElement, input) => {
  const newInput = input;
  const newErrorElement = errorElement;

  newInput.classList.remove('is-invalid');
  newErrorElement.textContent = '';
  newErrorElement.classList.remove('text-danger', 'text-success');
};

export default (state, input) => {
  const feedbackElement = document.querySelector('.feedback');

  if (!feedbackElement) {
    return;
  }

  if (state.error) {
    renderError(feedbackElement, input, state.error);
    return;
  }

  if (state.success) {
    renderSuccess(feedbackElement, input);
  } else {
    clearFeedback(feedbackElement, input);
  }
};
