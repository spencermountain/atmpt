import Node from './Node.js';
import fromString from './pack/fromString.js';
import toString from './pack/toString.js';
import VERSION from '../_version.js';

const reverseString = (str) => {
  return str.split('').reverse().join('');
}

class Trie {
  constructor(direction = 'prefix') {
    this.root = new Node();
    this.direction = direction;
    this.version = VERSION;
  }
  from(input) {
    // support for compressed string as input
    if (typeof input === 'string') {
      const { root, direction: dir, version } = fromString(input);
      this.root = root;
      this.direction = dir;
      this.version = version;
    } else if (Array.isArray(input)) {
      input.forEach(word => {
        this.add(word);
      });
    } else if (typeof input === 'object') {
      // support for object as input
      for (const [word, value] of Object.entries(input)) {
        this.add(word, value);
      }
    }
    return this;
  }
  add(word, value = true) {
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
    // this.root.prune();
    return this;
  }

  getNode(key) {
    let node = this.root;
    const processedKey = this.direction === 'suffix' ? reverseString(key) : key;
    const chars = [...processedKey];
    for (const char of chars) {
      node = node.children[char];
    }
    return node;
  }
  has(key) {
    let node = this.root;
    const processedKey = this.direction === 'suffix' ? reverseString(key) : key;
    const chars = [...processedKey];
    for (const char of chars) {
      if (!node.children[char]) {
        return false
      }
      node = node.children[char];
    }
    // must not match a incomplete word
    if (node.value === null) {
      return false
    }
    return true
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

  debug() {
    console.log('\n') // eslint-disable-line
    this.root.debug();
    console.log('\n\n') // eslint-disable-line
  }

  toString() {
    return toString(this.root, this.direction, this.version);
  }
  createNode() {
    return new Node();
  }
  static fromString(str) {
    const { root, direction, version } = fromString(str);
    if (version !== VERSION) {
      console.warn('Warning: Different atmpt version'); // eslint-disable-line
    }
    const trie = new Trie({}, direction);
    trie.root = root;
    return trie;
  }
}

export default Trie;