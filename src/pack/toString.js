import { escapeChar, escapeValue } from './escape.js';

// packed format:
//   <pre|post>|<version>            header
//   <tag>|<tag>|...                 dictionary, most frequent first
//   <body>                          the trie
//
// body grammar (unambiguous):
//   node  := chars? value? group?
//   value := digits '!'?            index into dictionary; '!' marks a rule value
//   group := '(' node+ ')'          required for 2+ children, and for ANY
//                                   children of a valued node — so a digit run
//                                   is always followed by '(' , ')' , a new
//                                   sibling, or the end of the string
//   chars := word characters; \ ( ) ! digits and newline are backslash-escaped
const toString = function (root, direction, version) {
  const valueDict = new Map();
  const frequencies = new Map();
  let nextIndex = 0;

  // First pass: count value frequencies, so common tags get short indices
  const countFrequencies = (node) => {
    if (node.value !== null) {
      frequencies.set(node.value, (frequencies.get(node.value) || 0) + 1);
    }
    Object.values(node.children).forEach(countFrequencies);
  };

  const assignIndices = () => {
    Array.from(frequencies.entries())
      .sort((a, b) => b[1] - a[1])
      .forEach(([value]) => {
        valueDict.set(value, nextIndex++);
      });
  };

  const buildString = (node) => {
    let result = '';
    if (node.value !== null) {
      result += valueDict.get(node.value).toString();
      if (node.rule) {
        result += '!';
      }
    }
    const childEntries = Object.entries(node.children)
      .sort((a, b) => (a[0] < b[0] ? -1 : 1));
    if (childEntries.length === 0) {
      return result;
    }
    // an unvalued single child continues inline as a character chain;
    // a valued node's children always get parens, to keep the format parseable
    if (childEntries.length === 1 && node.value === null) {
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

  const dictString = Array.from(valueDict.entries())
    .sort((a, b) => a[1] - b[1])
    .map(([value]) => escapeValue(value))
    .join('|');

  const directionMap = {
    'prefix': 'pre',
    'suffix': 'post'
  };
  return `${directionMap[direction]}|${version}\n${dictString}\n${buildString(root)}`;
}
export default toString
