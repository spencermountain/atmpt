// the burn report: what the rules did, and which words spoiled the near-misses.
// computed over complete evidence — this is where all conclusions live.
const label = (chars, direction) => {
  const str = chars.join('');
  return direction === 'suffix' ? '-' + [...str].reverse().join('') : str + '-';
};

const wordOf = (chars, direction) => {
  const str = chars.join('');
  return direction === 'suffix' ? [...str].reverse().join('') : str;
};

// stored words under this node that disagree with `best`
const findSpoilers = (node, chars, best, direction, out) => {
  if (out.length >= 5) {
    return;
  }
  if (node.val !== null && node.val !== best) {
    out.push(`${wordOf(chars, direction)} (${node.val})`);
  }
  for (const [ch, child] of Object.entries(node.children)) {
    findSpoilers(child, chars.concat(ch), best, direction, out);
  }
};

// nodes that would have minted a rule but for their spoilers
const findNearRules = (memRoot, { support, agreement }, direction) => {
  const near = [];
  const walk = (node, chars, reportedVal) => {
    let best = null;
    let count = 0;
    if (node.counts) {
      for (const [v, c] of node.counts) {
        if (c > count) {
          count = c;
          best = v;
        }
      }
    }
    const purity = node.total > 0 ? count / node.total : 0;
    if (purity >= agreement) {
      // an actual rule (or covered by one) — nothing near about it
      reportedVal = best;
    } else if (node.total >= support && purity >= 0.5 && best !== reportedVal && chars.length > 0) {
      const spoilers = [];
      findSpoilers(node, chars, best, direction, spoilers);
      near.push({
        label: label(chars, direction),
        val: best,
        count,
        total: node.total,
        spoilers,
      });
      reportedVal = best; // don't re-report the same story deeper down
    }
    for (const [ch, child] of Object.entries(node.children)) {
      walk(child, chars.concat(ch), reportedVal);
    }
  };
  walk(memRoot, [], null);
  return near.sort((a, b) => b.total - a.total);
};

const kb = (n) => (n / 1024).toFixed(1) + 'kb';
const fmt = (n) => n.toLocaleString('en-US');

const report = function (memRoot, stats, knobs, direction, image, verbatimSize) {
  const log = (str) => console.log(str); // eslint-disable-line
  const rules = [...stats.rules].sort((a, b) => b.covered - a.covered);
  const words = stats.covered + stats.kept;

  log('');
  log(`burn ▸ ${fmt(words)} words · support ${knobs.support} · agreement ${knobs.agreement}`);
  log(`  rules: ${fmt(rules.length)}   covered: ${fmt(stats.covered)}   kept: ${fmt(stats.kept)} (${fmt(stats.exceptions)} exceptions)`);
  log(`  image: ${kb(image.length)}  (verbatim: ${kb(verbatimSize)})`);

  if (rules.length > 0) {
    log('  top rules:');
    rules.slice(0, 8).forEach(r => {
      log(`    ${r.label} → ${r.val}   ${fmt(r.covered)} words`);
    });
  }
  const near = findNearRules(memRoot, knobs, direction);
  if (near.length > 0) {
    log('  near-rules:');
    near.slice(0, 8).forEach(n => {
      const spoilers = n.spoilers.length > 0 ? `   spoilers: ${n.spoilers.join(', ')}` : '';
      log(`    ${n.label} → ${n.val}   ${n.count}/${n.total}${spoilers}`);
    });
  }
  log('');
};
export default report;
