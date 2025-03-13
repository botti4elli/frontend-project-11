import * as yup from 'yup';

const schema = yup.object().shape({
  url: yup
    .string()
    .trim()
    .url('Ссылка должна быть валидным URL')
    .required('URL обязателен'),
});

export default (url, feeds) => schema.validate({ url })
  .then(() => {
    if (feeds.has(url)) {
      return Promise.reject(new Error('RSS уже существует'));
    }
    return Promise.resolve();
  });
