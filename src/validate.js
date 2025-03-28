import * as yup from 'yup';

yup.setLocale({
  string: { url: 'url_invalid' },
  mixed: { required: 'url_required' },
});

const schema = yup.object({
  url: yup.string().trim().url().required(),
});

export default (url, urls) => schema.validate({ url })
  .then(() => {
    if (urls.has(url)) {
      throw new Error('rss_exists');
    }
  })
  .catch((error) => {
    if (error instanceof yup.ValidationError) {
      throw new Error(error.message);
    }
    throw error;
  });
