class Node {
  constructor(label, val = null) {
    if (label) {
      this.label = label;
    }
    this.value = val;
    // true when this value was placed by generalize(), not by storing a word
    this.rule = false;
    this.children = {};
    // tag frequencies for every word passing through this node (built by add)
    this.counts = null;
    this.total = 0;
  }

  isLeaf() {
    return Object.keys(this.children).length === 0;
  }

  addCount(tag) {
    if (!this.counts) {
      this.counts = new Map();
    }
    this.counts.set(tag, (this.counts.get(tag) || 0) + 1);
    this.total += 1;
  }

  // most-frequent tag through this node, or null if no counts
  best() {
    if (!this.counts || this.total === 0) {
      return null;
    }
    let tag = null;
    let count = 0;
    for (const [t, c] of this.counts) {
      if (c > count) {
        count = c;
        tag = t;
      }
    }
    return { tag, count, total: this.total };
  }

  toJSON() {
    const result = {};
    if (this.value !== null) {
      result.value = this.value;
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
    if (this.value !== null) {
      console.log(`${prefix} [${this.value}]${this.rule ? '!' : ''}`);
    }

    for (const [char, child] of Object.entries(this.children)) {
      console.log(`${prefix}├── ${char}`);
      child.debug(prefix + '│   ');
    }
  }
}
export default Node
