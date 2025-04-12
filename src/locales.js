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
  VIEW: 'view',
  FEEDS_TITLE: 'feeds_title',
  POSTS_TITLE: 'posts_title',
  FORM_LOADING: 'form_loading',
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
        [translationKeys.URL_REQUIRED]: 'Не должно быть пустым',
        [translationKeys.RSS_EXISTS]: 'RSS уже существует',
        [translationKeys.RSS_INVALID]: 'Ресурс не содержит валидный RSS',
        [translationKeys.NETWORK_ERROR]: 'Ошибка сети',
        [translationKeys.TIMEOUT_ERROR]: 'Превышено время ожидания',
        [translationKeys.PARSE_ERROR]: 'Ошибка обработки RSS',
        [translationKeys.SERVER_ERROR]: 'Ошибка сервера',
        [translationKeys.EMPTY_RESPONSE]: 'Пустой ответ от сервера',
        [translationKeys.VIEW]: 'Просмотр',
        [translationKeys.FEEDS_TITLE]: 'Фиды',
        [translationKeys.POSTS_TITLE]: 'Посты',
        [translationKeys.FORM_LOADING]: 'Идет загрузка...',
      },
    },
  },
});

export default initI18n;
