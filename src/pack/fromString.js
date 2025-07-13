import parseTrie from './02-interpret.js';

const fromString = function (str) {
  const [header, dict, trieString] = str.split('\n');
  const [dir, version] = header.split('|');
  const direction = dir === 'pre' ? 'prefix' : 'suffix';

  // Unescape pipe characters in dictionary values
  const unescapeValue = (val) => val.replace(/\\\|/g, '|');
  const dictionary = dict ?
    dict.split(/(?<!\\)\|/).map(unescapeValue) : [];

  let root = parseTrie(trieString, dictionary)

  return {
    root: root,
    direction, version
  };
}
export default fromString