import { escapeChar, escapeValue } from './escape.js';

// image format:
//   <pre|suf>|<version>            header
//   <val>|<val>|...                dictionary, most frequent first
//   <body>                         the trie
//
// body grammar (unambiguous):
//   node  := chars? val? group?
//   val   := digits '!'?           index into dictionary; '!' marks a rule
//   group := '(' node+ ')'         required for 2+ children, and for ANY
//                                  children of a node carrying a val — so a
//                                  digit run is always followed by '(' , ')' ,
//                                  a new sibling, or the end of the string
//   chars := word characters; \ ( ) ! digits and newline are backslash-escaped
const toString = function (root, direction, version) {
  const valDict = new Map();
  const frequencies = new Map();
  let nextIndex = 0;

  // First pass: count val frequencies, so common vals get short indices
  const countFrequencies = (node) => {
    if (node.val !== null) {
      frequencies.set(node.val, (frequencies.get(node.val) || 0) + 1);
    }
    Object.values(node.children).forEach(countFrequencies);
  };

  const assignIndices = () => {
    Array.from(frequencies.entries())
      .sort((a, b) => b[1] - a[1])
      .forEach(([val]) => {
        valDict.set(val, nextIndex++);
      });
  };

  const buildString = (node) => {
    let result = '';
    if (node.val !== null) {
      result += valDict.get(node.val).toString();
      if (node.rule) {
        result += '!';
      }
    }
    const childEntries = Object.entries(node.children)
      .sort((a, b) => (a[0] < b[0] ? -1 : 1));
    if (childEntries.length === 0) {
      return result;
    }
    // a val-less single child continues inline as a character chain;
    // a val-carrying node's children always get parens, to stay parseable
    if (childEntries.length === 1 && node.val === null) {
      const [char, childNode] = childEntries[0];
      return result + escapeChar(char) + buildString(childNode);
    }
    const childStrings = childEntries.map(([char, childNode]) =>
      escapeChar(char) + buildString(childNode)
    );
    return result + `(${childStrings.join('')})`;
  };

  countFrequencies(root);
  assignIndices();

  const dictString = Array.from(valDict.entries())
    .sort((a, b) => a[1] - b[1])
    .map(([val]) => escapeValue(val))
    .join('|');

  const directionMap = {
    'prefix': 'pre',
    'suffix': 'suf'
  };
  return `${directionMap[direction]}|${version}\n${dictString}\n${buildString(root)}`;
}
export default toString
