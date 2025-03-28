import i18next from 'i18next';

export const translationKeys = {
  RSS_ADDED: 'rss_added',
  URL_INVALID: 'url_invalid',
  URL_REQUIRED: 'url_required',
  RSS_EXISTS: 'rss_exists',
  RSS_INVALID: 'rss_invalid',
  NETWORK_ERROR: 'network_error',
  TIMEOUT_ERROR: 'timeout_error',
  PARSE_ERROR: 'parse_error',
  SERVER_ERROR: 'server_error',
  EMPTY_RESPONSE: 'empty_response',
};

const initI18n = () => i18next.init({
  lng: 'ru',
  debug: false,
  returnNull: false,
  resources: {
    ru: {
      translation: {
        [translationKeys.RSS_ADDED]: 'RSS успешно загружен',
        [translationKeys.URL_INVALID]: 'Ссылка должна быть валидным URL',
        [translationKeys.URL_REQUIRED]: 'Необходимо ввести ссылку',
        [translationKeys.RSS_EXISTS]: 'RSS уже существует',
        [translationKeys.RSS_INVALID]: 'Некорректный RSS',
        [translationKeys.NETWORK_ERROR]: 'Ошибка сети. Проверьте подключение',
        [translationKeys.TIMEOUT_ERROR]: 'Превышено время ожидания ответа',
        [translationKeys.PARSE_ERROR]: 'Ошибка разбора RSS-потока',
        [translationKeys.SERVER_ERROR]: 'Ошибка сервера: {{status}}',
        [translationKeys.EMPTY_RESPONSE]: 'Пустой ответ от сервера',
      },
    },
  },
});

export default initI18n;
