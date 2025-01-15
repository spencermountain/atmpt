import { Node } from './Node.js';

export class Trie {
  constructor(input) {
    this.root = new Node();
    this.direction = 'prefix';
    this.add(input);
  }

  add(object = {}) {
    for (const [word, value] of Object.entries(object)) {
      let node = this.root;
      for (const char of word) {
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

    for (const char of key) {
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