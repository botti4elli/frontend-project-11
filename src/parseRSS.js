import { parseXmlString, getTextContent } from './utils.js';

export default (xmlString) => {
  const doc = parseXmlString(xmlString);
  const parserError = doc.querySelector('parsererror');
  if (parserError) throw new Error('rss_invalid');

  const feedTitle = getTextContent(doc.querySelector('channel > title'));
  const feedDescription = getTextContent(doc.querySelector('channel > description'));

  const posts = [...doc.querySelectorAll('item')].map((item) => ({
    title: getTextContent(item.querySelector('title')),
    description: getTextContent(item.querySelector('description')),
    link: getTextContent(item.querySelector('link')),
  }));

  return {
    feed: { title: feedTitle, description: feedDescription },
    posts,
  };
};
