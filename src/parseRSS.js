// import generateId from './utils.js';
//
// const sanitizeHTML = (html) => {
//   const temp = document.createElement('div');
//   temp.innerHTML = html;
//   return temp.textContent || temp.innerText || '';
// };
//
// const decodeEntities = (text) => {
//   const textarea = document.createElement('textarea');
//   textarea.innerHTML = text;
//   return textarea.value;
// };
//
// const getTextContent = (element, defaultValue = '') => (
//   element ? decodeEntities(sanitizeHTML(element.textContent.trim())) : defaultValue
// );
//
// const parseRSS = (xmlString) => {
//   const parser = new DOMParser();
//   const xmlDoc = parser.parseFromString(xmlString, 'application/xml');
//
//   const errorNode = xmlDoc.querySelector('parsererror');
//   if (errorNode) {
//     throw new Error('parse_error');
//   }
//
//   const channel = xmlDoc.querySelector('channel');
//   const items = xmlDoc.querySelectorAll('item');
//
//   if (!channel || items.length === 0) {
//     throw new Error('rss_invalid');
//   }
//
//   const feedId = generateId();
//   const feed = {
//     id: feedId,
//     title: getTextContent(channel.querySelector('title'), 'Без названия'),
//     description: getTextContent(channel.querySelector('description'), 'Описание отсутствует'),
//     link: getTextContent(channel.querySelector('link'), '#'),
//   };
//
//   const postsById = {};
//   const postLinks = new Set();
//
//   items.forEach((item) => {
//     const link = getTextContent(item.querySelector('link'), '#');
//     const guid = getTextContent(item.querySelector('#guid'), link);
//
//     if (postLinks.has(guid)) return;
//     postLinks.add(guid);
//
//     const postId = generateId();
//     postsById[postId] = {
//       id: postId,
//       feedId,
//       title: getTextContent(item.querySelector('title'), 'Без названия') || 'Без названия',
//       description: getTextContent(item.querySelector('description'), 'Описание отсутствует') || 'Описание отсутствует',
//       link,
//     };
//   });
//
//   return {
//     feed,
//     posts: Object.values(postsById),
//   };
// };
//
// export default parseRSS;
import generateId from './utils.js';

const sanitizeHTML = (html) => {
  const temp = document.createElement('div');
  temp.innerHTML = html;
  return temp.textContent || temp.innerText || '';
};

const decodeEntities = (text) => {
  const textarea = document.createElement('textarea');
  textarea.innerHTML = text;
  return textarea.value;
};

const getTextContent = (element, defaultValue = '') => (
    element ? decodeEntities(sanitizeHTML(element.textContent.trim())) : defaultValue
);

const parseRSS = (xmlString) => {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlString, 'application/xml');

  console.log('Parsed XML:', xmlDoc);

  const errorNode = xmlDoc.querySelector('parsererror');
  if (errorNode) {
    console.error('XML Parsing Error:', errorNode.textContent);
    throw new Error('rss_invalid'); // исправлено
  }

  const channel = xmlDoc.querySelector('channel');
  const items = xmlDoc.querySelectorAll('item');

  if (!channel || items.length === 0) {
    console.error('Invalid RSS structure:', { channel, itemsLength: items.length });
    throw new Error('rss_invalid'); // исправлено
  }

  const feedId = generateId();
  const feed = {
    id: feedId,
    title: getTextContent(channel.querySelector('title'), 'Без названия'),
    description: getTextContent(channel.querySelector('description'), 'Описание отсутствует'),
    link: getTextContent(channel.querySelector('link'), '#'),
  };

  const postsById = {};
  const postLinks = new Set();

  items.forEach((item) => {
    const link = getTextContent(item.querySelector('link'), '#');
    const guid = getTextContent(item.querySelector('guid'), link);

    if (postLinks.has(guid)) return;
    postLinks.add(guid);

    const postId = generateId();
    postsById[postId] = {
      id: postId,
      feedId,
      title: getTextContent(item.querySelector('title'), 'Без названия'),
      description: getTextContent(item.querySelector('description'), 'Описание отсутствует'),
      link,
    };
  });

  return {
    feed,
    posts: Object.values(postsById),
  };
};

export default parseRSS;
