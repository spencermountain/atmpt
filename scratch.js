import { Trie } from './src/index.js';
import { examples } from './examples/prefixes.js';
import assert from 'assert';

let obj = examples.b;
const trie = new Trie();
trie.add(obj);

trie.print();

// test
Object.entries(obj).forEach(([word, val]) => {
  const result = trie.get(word);
  console.log(`${word} -> ${result}, ${val}`);
  assert.strictEqual(result, val, `${word} : ${result}  (wanted ${val})`);
});

// console.log(trie.get('doughnuasdf'));
// console.log(trie.get('doughnu'));
// console.log(trie.get('doughn'));
// console.log(trie.get('dough'));
// console.log(trie.get('doug'));
// console.log(trie.get('dou'));
// console.log(trie.get('do'));
