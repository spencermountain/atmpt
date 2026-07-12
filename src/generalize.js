// collapse pure subtrees into rule values, keep disagreeing words in place.
// `inherited` is the deepest value on the path above this node — under
// longest-match lookup, that's the answer a word gets if nothing deeper fires.
const generalizeNode = function (node, opts, inherited) {
  const stats = node.best();
  const canRule = stats !== null
    && stats.total >= opts.minSupport
    && stats.count / stats.total >= opts.minPurity
    && (node.value === null || node.value === stats.tag);

  let effective = inherited;
  if (canRule) {
    if (stats.tag === inherited.tag && inherited.isRule) {
      // an ancestor rule already gives this answer — no value needed here
      if (node.value === stats.tag) {
        node.value = null;
        node.rule = false;
      }
    } else {
      node.value = stats.tag;
      node.rule = true;
    }
    effective = { tag: stats.tag, isRule: true };
  } else if (node.value !== null) {
    if (node.value === inherited.tag && inherited.isRule) {
      // stored word agrees with a covering rule — redundant
      node.value = null;
      node.rule = false;
    } else {
      // disagreeing word stays put; it shadows the rule for its subtree
      effective = { tag: node.value, isRule: node.rule };
    }
  }

  for (const [char, child] of Object.entries(node.children)) {
    generalizeNode(child, opts, effective);
    if (child.value === null && child.isLeaf()) {
      delete node.children[char];
    }
  }
};

const generalize = function (root, { minSupport = 3, minPurity = 0.85 } = {}) {
  generalizeNode(root, { minSupport, minPurity }, { tag: null, isRule: false });
};
export default generalize;
