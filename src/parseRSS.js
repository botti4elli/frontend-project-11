import generateId from './utils.js';

const parseRSS = (xmlString) => {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlString, 'application/xml');

  const errorNode = xmlDoc.querySelector('parsererror');
  if (errorNode) {
    throw new Error('parse_error');
  }

  const channel = xmlDoc.querySelector('channel');
  const items = xmlDoc.querySelectorAll('item');

  if (!channel || items.length === 0) {
    throw new Error('rss_invalid');
  }

  const feedId = generateId();
  const feed = {
    id: feedId,
    title: channel.querySelector('title').textContent,
    description: channel.querySelector('description').textContent,
    link: channel.querySelector('link').textContent,
  };

  const postsById = {};

  items.forEach((item) => {
    const postId = generateId();
    postsById[postId] = {
      id: postId,
      feedId,
      title: item.querySelector('title').textContent,
      description: item.querySelector('description').textContent,
      link: item.querySelector('link').textContent,
    };
  });

  return {
    feed,
    posts: Object.values(postsById), // Теперь это массив
  };
};

export default parseRSS;
