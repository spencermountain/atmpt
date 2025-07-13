import Trie from './Trie.js';

const atmpt = function (input, direction = 'suffix') {
  let trie = new Trie(direction)
  if (input) {
    trie.from(input)
  }
  return trie;
}

atmpt.unpack = function (str) {
  return Trie.fromString(str)
}

export default atmpt;