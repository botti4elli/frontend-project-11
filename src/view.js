export default (state, input) => {
  const feedbackElement = document.querySelector('.feedback');

  if (!feedbackElement) {
    console.warn('Элемент .feedback не найден');
    return;
  }

  if (state.error) {
    input.classList.add('is-invalid');
    feedbackElement.textContent = state.error;
    feedbackElement.classList.add('text-danger');
    feedbackElement.classList.remove('text-success');
    return;
  }

  input.classList.remove('is-invalid');

  if (state.success) {
    feedbackElement.textContent = 'RSS успешно загружен';
    feedbackElement.classList.add('text-success');
    feedbackElement.classList.remove('text-danger');
  } else {
    feedbackElement.textContent = '';
  }
};
