export function buildImprovSequence(pool, count) {
  const sequence = [];
  let prevKey = "";
  for (let slot = 0; slot < count; slot++) {
    let combo;
    for (let attempt = 0; attempt < 8; attempt++) {
      const first = pool[Math.floor(Math.random() * pool.length)];
      const isPair = Math.random() < 0.45;
      let second = pool[Math.floor(Math.random() * pool.length)];
      if (
        (second === first &&
          (second = pool[(pool.indexOf(first) + 1) % pool.length]),
        (combo = isPair ? [first, second] : [first]),
        combo.join() !== prevKey)
      )
        break;
    }
    prevKey = combo.join();
    sequence.push(combo);
  }
  return sequence;
}
