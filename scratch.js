import { Trie } from './src/index.js';
import { prefixes, suffixes } from './examples.js';
import assert from 'assert';


let obj = prefixes.c;
const trie = new Trie(obj, 'prefix');
// let obj = suffixes.y;
// const trie = new Trie(obj, 'suffix');
trie.add(obj);

trie.print();
console.log(trie.toString());




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
