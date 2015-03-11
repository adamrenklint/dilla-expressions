function expressions (events, barsPerLoop, beatsPerBar) {

  if (!events) throw new Error('Invalid events array');
  if (!barsPerLoop || typeof barsPerLoop !== 'number') throw new Error('Invalid "barsPerLoop" argument');
  if (!beatsPerBar || typeof beatsPerBar !== 'number') throw new Error('Invalid "barsPerLoop" argument');

  return events.sort(function (a, b) {
    return a < b ? -1 : a > b ? 1 : 0;
  });
}

module.exports = expressions;