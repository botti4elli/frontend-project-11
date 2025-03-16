import i18next from 'i18next';

const initI18n = () => i18next.init({
  lng: 'ru',
  debug: false,
  returnNull: false,
  resources: {
    ru: {
      translation: {
        rss_added: 'RSS успешно добавлен',
        url_invalid: 'Ссылка должна быть валидным URL',
        url_required: 'Необходимо ввести ссылку',
        rss_exists: 'RSS уже существует',
      },
    },
  },
});

export default initI18n;
