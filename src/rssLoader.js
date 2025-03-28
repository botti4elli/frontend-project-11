import axios from 'axios';
import parseRSS from './parseRSS.js';

const MAX_RETRIES = 2;
const TIMEOUT = 5000;

const fetchWithRetry = (url, retries = MAX_RETRIES) => {
  const proxyUrl = `https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(url)}`;

  return axios.get(proxyUrl, { timeout: TIMEOUT })
    .catch((error) => {
      if (retries > 0 && (error.code === 'ECONNABORTED' || !error.response)) {
        return fetchWithRetry(url, retries - 1);
      }
      throw error;
    });
};

const fetchRSS = (url) => fetchWithRetry(url)
  .then((response) => {
    if (!response.data.contents) {
      throw new Error('empty_response');
    }
    return response.data.contents;
  })
  .then(parseRSS)
  .catch((error) => {
    if (error.code === 'ECONNABORTED') throw new Error('timeout_error');
    if (error.response) throw new Error(`server_error_${error.response.status}`);
    throw new Error('network_error');
  });

export default fetchRSS;
