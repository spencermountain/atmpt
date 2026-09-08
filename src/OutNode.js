// a node in a burned trie: a val, a rule flag, children. no evidence.
class OutNode {
  constructor() {
    this.val = null;
    // true when this val was placed by the burn (fires for unseen words);
    // false when it is a stored word (fires on exact match only)
    this.rule = false;
    this.children = {};
  }

  isLeaf() {
    return Object.keys(this.children).length === 0;
  }

  toJSON() {
    const result = {};
    if (this.val !== null) {
      result.val = this.val;
      if (this.rule) {
        result.rule = true;
      }
    }
    if (!this.isLeaf()) {
      result.children = {};
      for (const [char, node] of Object.entries(this.children)) {
        result.children[char] = node.toJSON();
      }
    }
    return result;
  }

  debug(prefix = '') {
    if (this.val !== null) {
      console.log(`${prefix} [${this.val}]${this.rule ? '!' : ''}`); // eslint-disable-line
    }
    for (const [char, child] of Object.entries(this.children)) {
      console.log(`${prefix}├── ${char}`); // eslint-disable-line
      child.debug(prefix + '│   ');
    }
  }
}
export default OutNode
