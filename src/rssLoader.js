import axios from 'axios';
import parseRSS from './parseRSS.js';

const MAX_RETRIES = 2;
const TIMEOUT = 5000;

const fetchWithRetry = (url, retries = MAX_RETRIES) => {
  const proxyUrl = `https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(url)}`;

  return axios.get(proxyUrl, { timeout: TIMEOUT })
    .then((response) => {
      if (!response.data.contents) {
        console.error('Empty response received');
        throw new Error('empty_response');
      }
      return response.data.contents;
    })
    .catch((error) => {
      if (retries > 0 && (error.code === 'ECONNABORTED' || !error.response)) {
        console.warn(`Retrying fetch: ${url} (${MAX_RETRIES - retries + 1}/${MAX_RETRIES})`);
        return fetchWithRetry(url, retries - 1);
      }
      console.error('Fetching RSS failed:', error.message);
      throw error;
    });
};

const fetchRSS = (url) => fetchWithRetry(url)
  .then((data) => {
    try {
      return parseRSS(data);
    } catch (error) {
      console.error('RSS Parsing Error:', error.message);
      if (error.message === 'rss_invalid') throw error;
      throw new Error('parse_error');
    }
  })
  .catch((error) => {
    console.error('Ошибка при загрузке RSS:', error.message);

    if (error.message === 'rss_invalid') throw error;
    if (error.code === 'ECONNABORTED') throw new Error('timeout_error');
    if (error.response) throw new Error(`server_error_${error.response.status}`);
    throw new Error('network_error');
  });

export default fetchRSS;
