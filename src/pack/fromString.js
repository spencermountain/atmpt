import parseTrie from './02-interpret.js';

const fromString = function (str) {
  const [header, dict, trieString] = str.split('\n');
  const [dir, version] = header.split('|');
  const direction = dir === 'pre' ? 'prefix' : 'suffix';

  // Unescape pipe characters in dictionary values
  const unescapeValue = (val) => val.replace(/\\\|/g, '|');
  const dictionary = dict ?
    dict.split(/(?<!\\)\|/).map(unescapeValue) : [];

  console.log('hello', str)
  let root = parseTrie(trieString, dictionary)

  // let pos = 0;
  // const parseNode = () => {
  //   const node = trie.createNode();
  //   console.log(trieString[pos], pos, trieString.slice(pos))
  //   // is it a number?
  //   if (/^\d/.test(trieString.slice(pos))) {
  //     const match = trieString.slice(pos).match(/^\d+/)[0];
  //     let index = parseInt(match, 10);
  //     node.value = dictionary[index];
  //     pos += match.length;
  //   }
  //   // node is completed
  //   if (pos >= trieString.length || trieString[pos] === ')') {
  //     return node;
  //   }

  //   // greedy continue until end of node
  //   if (trieString[pos] === '(') {
  //     pos += 1
  //     console.log('entering loop')
  //     while (pos < trieString.length && trieString[pos] !== ')') {
  //       const char = trieString[pos++];
  //       node.children[char] = parseNode();
  //     }
  //     pos += 1
  //     console.log('exiting loop')
  //   } else {
  //     const char = trieString[pos++];
  //     node.children[char] = parseNode();
  //   }

  //   return node;
  // };

  return {
    root: root,
    direction, version
  };
}
export default fromString