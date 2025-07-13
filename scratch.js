import atmpt from './src/index.js';
import { prefixes, suffixes } from './tests/_examples.js';
import assert from 'assert';
import fs from 'fs';

let inputs = [
  'pre',
  'preone',
  'preok',
  'pretwo',
]
let trie = atmpt('prefix')
inputs.forEach(word => {
  trie.add(word)
})
let packed = trie.toString()
console.log(packed)
// trie.debug()

// let tests = [
//   'spoon',
//   'spoons',
//   'spooned',
// ]
let after = atmpt.unpack(packed)
after.debug()
// tests.forEach(word => {
//   console.log(word, after.has(word))
// })

// console.log(trie)

// test
// Object.entries(obj).forEach(([word, val]) => {
//   const result = trie.get(word);
//   console.log(`${word} -> ${result}, ${val}`);
//   assert.strictEqual(result, val, `${word} : ${result}  (wanted ${val})`);
// });

// console.log(trie.get('doughnuasdf'));
// console.log(trie.get('doughnu'));
// console.log(trie.get('doughn'));
// console.log(trie.get('dough'));
// console.log(trie.get('doug'));
// console.log(trie.get('dou'));
// console.log(trie.get('do'));
