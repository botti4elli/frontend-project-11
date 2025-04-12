import { parseXmlString, getTextContent, generateId } from './utils.js';

const parseRSS = (xmlString) => {
  const xmlDoc = parseXmlString(xmlString);

  const errorNode = xmlDoc.querySelector('parsererror');
  if (errorNode) throw new Error('rss_invalid');

  const channel = xmlDoc.querySelector('channel');
  const items = xmlDoc.querySelectorAll('item');
  if (!channel || items.length === 0) throw new Error('rss_invalid');

  const feedLink = getTextContent(channel.querySelector('link'), '#');
  const feedId = generateId(feedLink);

  const feed = {
    id: feedId,
    title: getTextContent(channel.querySelector('title'), 'Без названия'),
    description: getTextContent(channel.querySelector('description'), 'Описание отсутствует'),
    link: feedLink,
  };

  const posts = [];
  const seenGuids = new Set();

  items.forEach((item) => {
    const link = getTextContent(item.querySelector('link'), '#');
    const guidEl = item.getElementsByTagName('guid')[0];
    const guid = getTextContent(guidEl) || link;

    if (!seenGuids.has(guid)) {
      seenGuids.add(guid);

      posts.push({
        id: generateId(guid),
        feedId,
        title: getTextContent(item.querySelector('title'), 'Без названия'),
        description: getTextContent(item.querySelector('description'), 'Описание отсутствует'),
        link,
      });
    }
  });

  return { feed, posts };
};

export default parseRSS;
