import OutNode from './OutNode.js';
import fromString from './pack/fromString.js';
import toString from './pack/toString.js';
import VERSION from '../_version.js';

// a burned trie, loaded from an image: rules + exceptions, no evidence.
// it can answer lookups and take exact-word patches, but it can never mint
// a rule — rules only come from a burn, where the evidence is complete.
class Out {
  constructor(direction = 'suffix') {
    this.root = new OutNode();
    this.direction = direction;
    this.version = VERSION;
    this.patched = 0;
  }
  // word -> array of chars, reversed for suffix tries (surrogate-safe)
  chars(word) {
    const arr = [...word];
    if (this.direction === 'suffix') {
      arr.reverse();
    }
    return arr;
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
    return node !== null && node.val !== null;
  }
  // the val for this word: its stored val if the full path ends on one,
  // otherwise the deepest rule along the way (a generalized guess)
  get(key) {
    let node = this.root;
    let deepestRule = node.rule && node.val !== null ? node.val : null;
    for (const char of this.chars(key)) {
      node = node.children[char];
      if (!node) {
        return deepestRule;
      }
      if (node.val !== null && node.rule) {
        deepestRule = node.val;
      }
    }
    if (node.val !== null) {
      return node.val;
    }
    return deepestRule;
  }

  // add one exact word to a burned trie. always correct, never generalizes —
  // but bytes pile up; re-burning from the source words is the better path.
  patch(word, val = true) {
    let node = this.root;
    for (const char of this.chars(word)) {
      if (!node.children[char]) {
        node.children[char] = new OutNode();
      }
      node = node.children[char];
    }
    if (node.rule && node.val !== val) {
      // an exact word displaces a rule that ends on the same node
      node.rule = false;
    }
    node.val = val;
    this.patched += 1;
    return this;
  }

  toString() {
    return toString(this.root, this.direction, this.version);
  }
  toJSON() {
    return this.root.toJSON();
  }
  debug() {
    console.log('\n'); // eslint-disable-line
    this.root.debug();
    console.log('\n\n'); // eslint-disable-line
  }

  static load(image) {
    const { root, direction, version } = fromString(image);
    if (version !== VERSION) {
      console.warn('Warning: image from a different atmpt version'); // eslint-disable-line
    }
    const out = new Out(direction);
    out.root = root;
    return out;
  }
}

export default Out;
