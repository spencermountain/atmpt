import { Node } from './Node.js';

const reverseString = (str) => {
  return str.split('').reverse().join('');
}

export class Trie {
  constructor(input, direction = 'prefix') {
    this.root = new Node();
    this.direction = direction;
    this.add(input);
  }

  add(object = {}) {
    for (const [word, value] of Object.entries(object)) {
      let node = this.root;
      const processedWord = this.direction === 'suffix' ? reverseString(word) : word;
      const chars = [...processedWord];

      for (const char of chars) {
        if (!node.children[char]) {
          node.children[char] = new Node();
        }
        node = node.children[char];
      }
      node.value = value;
    }
    this.root.prune();
    return this;
  }

  get(key) {
    let bestMatch = null;
    let node = this.root;
    const processedKey = this.direction === 'suffix' ? reverseString(key) : key;
    const chars = [...processedKey];

    for (const char of chars) {
      if (!node.children[char]) {
        break;
      }
      node = node.children[char];
      if (node.value !== null) {
        bestMatch = node.value;
      }
    }

    return bestMatch;
  }

  toJSON() {
    return this.root.toJSON();
  }

  print() {
    this.root.print();
  }
} 