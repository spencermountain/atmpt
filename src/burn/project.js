import OutNode from '../OutNode.js';

// project a Memory trie into a burned Out trie, without touching the Memory.
// pure interior nodes become rules; words a rule covers are not carried over;
// disagreeing words stay, as exceptions that shadow the rule.
// `inherited` is the deepest val on the path above — under longest-match
// lookup, that's the answer a word gets when nothing deeper fires.
const project = function (memRoot, { support, agreement }, direction) {
  const stats = {
    rules: [],       // { chars, val, covered }
    covered: 0,      // words absorbed by rules
    kept: 0,         // words carried into the image
    exceptions: 0,   // kept words that shadow a covering rule
  };

  const build = (memNode, inherited, chars) => {
    let best = null;
    let count = 0;
    if (memNode.counts) {
      for (const [v, c] of memNode.counts) {
        if (c > count) {
          count = c;
          best = v;
        }
      }
    }
    const canRule = memNode.total >= support
      && count / memNode.total >= agreement
      && (memNode.val === null || memNode.val === best);

    const out = new OutNode();
    let effective = inherited;
    if (canRule) {
      if (best === inherited.val && inherited.isRule) {
        // an ancestor rule already gives this answer — no val needed here
        if (memNode.val === best) {
          stats.covered += 1;
          inherited.ref.covered += 1;
        }
        effective = inherited;
      } else {
        out.val = best;
        out.rule = true;
        const ref = { chars, val: best, covered: 0 };
        stats.rules.push(ref);
        if (memNode.val === best) {
          // the word ending exactly here is absorbed by its own rule
          stats.covered += 1;
          ref.covered += 1;
        }
        effective = { val: best, isRule: true, ref };
      }
    } else if (memNode.val !== null) {
      if (memNode.val === inherited.val && inherited.isRule) {
        // stored word agrees with a covering rule — absorbed
        stats.covered += 1;
        inherited.ref.covered += 1;
      } else {
        out.val = memNode.val;
        stats.kept += 1;
        if (inherited.isRule) {
          stats.exceptions += 1;
        }
        // a disagreeing word shadows the rule for everything beneath it
        effective = { val: memNode.val, isRule: false, ref: null };
      }
    }

    for (const [char, memChild] of Object.entries(memNode.children)) {
      const outChild = build(memChild, effective, chars.concat(char));
      if (outChild !== null) {
        out.children[char] = outChild;
      }
    }
    if (out.val === null && out.isLeaf()) {
      return null;
    }
    return out;
  };

  const root = build(memRoot, { val: null, isRule: false, ref: null }, []) || new OutNode();
  // human-readable pattern labels, e.g. "-est" or "walk-"
  stats.rules.forEach(r => {
    const str = r.chars.join('');
    r.label = direction === 'suffix' ? '-' + [...str].reverse().join('') : str + '-';
  });
  return { root, stats };
};
export default project;
