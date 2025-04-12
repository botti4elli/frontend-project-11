const decodeEntities = (text) => {
  const el = document.createElement('div');
  el.innerHTML = text;
  return el.textContent || '';
};

const getTextContent = (el, def = '') => (el ? decodeEntities(el.textContent.trim()) : def);

const parseXmlString = (xmlString) => {
  const parser = new DOMParser();
  return parser.parseFromString(xmlString, 'application/xml');
};

const generateId = () => crypto.randomUUID?.() || Math.random().toString(36).slice(2, 10);

export {
  decodeEntities,
  getTextContent,
  parseXmlString,
  generateId,
};
