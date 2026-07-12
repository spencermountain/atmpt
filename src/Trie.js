import Node from './Node.js';
import fromString from './pack/fromString.js';
import toString from './pack/toString.js';
import generalize from './generalize.js';
import VERSION from '../_version.js';

class Trie {
  constructor(direction = 'prefix') {
    this.root = new Node();
    this.direction = direction;
    this.version = VERSION;
  }
  // word -> array of chars, reversed for suffix tries (surrogate-safe)
  chars(word) {
    const arr = [...word];
    if (this.direction === 'suffix') {
      arr.reverse();
    }
    return arr;
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
    node.addCount(value);
    for (const char of this.chars(word)) {
      if (!node.children[char]) {
        node.children[char] = new Node();
      }
      node = node.children[char];
      node.addCount(value);
    }
    node.value = value;
    node.rule = false;
    return this;
  }

  getNode(key) {
    let node = this.root;
    for (const char of this.chars(key)) {
      node = node.children[char];
      if (!node) {
        return null;
      }
    }
    return node;
  }
  // is this word (or rule ending) explicitly stored?
  has(key) {
    const node = this.getNode(key);
    return node !== null && node.value !== null;
  }
  // the tag for this word: its stored value if the full path ends on one,
  // otherwise the deepest rule value along the way (a generalized guess)
  get(key) {
    let node = this.root;
    let deepestRule = node.rule && node.value !== null ? node.value : null;
    for (const char of this.chars(key)) {
      node = node.children[char];
      if (!node) {
        return deepestRule;
      }
      if (node.value !== null && node.rule) {
        deepestRule = node.value;
      }
    }
    if (node.value !== null) {
      return node.value;
    }
    return deepestRule;
  }

  // collapse pure subtrees into suffix/prefix rules; keep exceptions in place
  generalize(opts = {}) {
    generalize(this.root, opts);
    return this;
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
    const trie = new Trie(direction);
    trie.root = root;
    return trie;
  }
}

export default Trie;
