export function fromString(str, trie) {
  const [headerString, dictString, trieString] = str.split('\n');
  const [dir, version] = headerString.split('|');
  const direction = dir === 'pre' ? 'prefix' : 'suffix';

  // Unescape pipe characters in dictionary values
  const unescapeValue = (val) => val.replace(/\\\|/g, '|');
  const dictionary = dictString ?
    dictString.split(/(?<!\\)\|/).map(unescapeValue) : [];

  // const trie = new Trie(direction);
  let pos = 0;

  const parseNode = () => {
    const node = trie.createNode();

    if (/^\d/.test(trieString.slice(pos))) {
      const match = trieString.slice(pos).match(/^\d+/)[0];
      node.value = dictionary[parseInt(match)];
      pos += match.length;
    }

    if (pos >= trieString.length || trieString[pos] === ')') {
      return node;
    }

    if (trieString[pos] === '(') {
      pos++;
      while (pos < trieString.length && trieString[pos] !== ')') {
        const char = trieString[pos++];
        node.children[char] = parseNode();
      }
      pos++;
    } else {
      const char = trieString[pos++];
      node.children[char] = parseNode();
    }

    return node;
  };

  return {
    root: parseNode(),
    direction, version
  };
} 