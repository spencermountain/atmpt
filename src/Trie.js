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

  toString() {
    const buildString = (node) => {
      if (Object.keys(node.children).length === 0) {
        return node.value !== null ? `[${node.value}]` : '';
      }

      let result = '';
      const childEntries = Object.entries(node.children);

      // Add value if exists
      if (node.value !== null) {
        result += `[${node.value}]`;
      }

      // Handle single child case without parentheses
      if (childEntries.length === 1) {
        const [char, childNode] = childEntries[0];
        return result + char + buildString(childNode);
      }

      // Handle multiple children with parentheses
      const childStrings = childEntries.map(([char, childNode]) =>
        char + buildString(childNode)
      );
      return result + `(${childStrings.join('')})`;
    };

    return buildString(this.root);
  }
} 