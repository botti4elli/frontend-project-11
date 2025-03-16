import * as yup from 'yup';

yup.setLocale({
  string: {
    url: 'url_invalid',
  },
  mixed: {
    required: 'url_required',
  },
});

const schema = yup.object({
  url: yup.string().trim().url().required(),
});

export default (url, feeds) => schema.validate({ url })
  .then(() => {
    if (feeds.has(url)) {
      const error = new Error('rss_exists');
      error.code = 'rss_exists';
      return Promise.reject(error);
    }
    return Promise.resolve();
  })
  .catch((error) => {
    if (error instanceof yup.ValidationError) {
      return Promise.reject(new Error(error.message));
    }
    return Promise.reject(error);
  });
