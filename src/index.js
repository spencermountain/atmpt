export { Trie } from './Trie.js';

export function addPrefix(trie, object) {
  const newTrie = Trie.fromJSON(trie);
  return newTrie.addPrefix(object).toJSON();
}

export function addSuffix(trie, object) {
  const newTrie = Trie.fromJSON(trie);
  return newTrie.addSuffix(object).toJSON();
}

export function parseTrie(str) {
  return Trie.parse(str).toJSON();
}

export function packTrie(trie) {
  return Trie.fromJSON(trie).pack();
} 