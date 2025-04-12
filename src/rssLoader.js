import axios from 'axios';
import parseRSS from './parseRSS.js';
import { generateId } from './utils.js';

const MAX_RETRIES = 2;
const TIMEOUT = 5000;

const buildProxyUrl = (url) => {
  const proxy = new URL('https://allorigins.hexlet.app/get');
  proxy.searchParams.set('disableCache', 'true');
  proxy.searchParams.set('url', url);
  return proxy.toString();
};

const handleError = (error) => {
  if (error.message === 'rss_invalid' || error.message === 'empty_response') {
    throw error;
  }

  if (error.code === 'ECONNABORTED') {
    throw new Error('timeout_error');
  }

  if (error.response) {
    throw new Error(`server_error_${error.response.status}`);
  }

  throw new Error('network_error');
};

const fetchRSS = (url) => {
  const proxyUrl = buildProxyUrl(url);

  const attempt = (retriesLeft) => axios.get(proxyUrl, { timeout: TIMEOUT })
    .then((response) => {
      const contents = response.data?.contents;
      if (!contents) throw new Error('empty_response');

      try {
        const { feed, posts } = parseRSS(contents);

        const feedId = generateId(feed.link);

        const enrichedFeed = { ...feed, id: feedId };
        const enrichedPosts = posts.map((post) => ({
          ...post,
          id: generateId(post.link),
          feedId,
        }));

        return { feed: enrichedFeed, posts: enrichedPosts };
      } catch (e) {
        throw new Error(e.message === 'rss_invalid' ? 'rss_invalid' : 'parse_error');
      }
    })
    .catch((error) => {
      const canRetry = retriesLeft > 0
            && (error.code === 'ECONNABORTED' || !error.response);

      if (canRetry) {
        return attempt(retriesLeft - 1);
      }

      return handleError(error);
    });

  return attempt(MAX_RETRIES);
};

export default fetchRSS;
