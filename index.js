function isPlainPosition (position) {
  return !!position.match(/^\d+\.\d+\.\d+$/);
}

function getPossiblePositions (barsPerLoop, beatsPerBar) {
  var possibles = [];
  var bar = 0, beat, tick, displayTick;
  while (++bar <= barsPerLoop) {
    beat = 0;
    while (++beat <= beatsPerBar) {
      tick = 0;
      while (++tick <= 96) {
        displayTick = tick < 10 ? '0' + tick : tick;
        possibles.push([bar, beat, displayTick].join('.'))
      }
    }
  }
  return possibles;
}

function getFragments (position) {
  return position.split('.').map(function (fragment) {
    var fragmentNumber = parseInt(fragment, 10);
    if (!isNaN(fragmentNumber)) return fragmentNumber;
    return fragment;
  })
}

function makeExpressionFunction (expression) {
  var exprFragments = getFragments(expression);
  return function expressionFn (position) {
    var positionFragments = getFragments(position);
    var valid = true;
    exprFragments.forEach(function (exprFragment, index) {
      if (exprFragment === '*') return;
      if (exprFragment === 'even' && positionFragments[index] % 2 === 0) return;
      if (exprFragment === 'odd' && positionFragments[index] % 2 === 1) return;
      if (typeof exprFragment === 'number' && positionFragments[index] === exprFragment) return;
      valid = false;
    });
    return valid;
  }
}

function expressions (events, barsPerLoop, beatsPerBar) {

  if (!events) throw new Error('Invalid events array');
  if (!barsPerLoop || typeof barsPerLoop !== 'number') throw new Error('Invalid "barsPerLoop" argument');
  if (!beatsPerBar || typeof beatsPerBar !== 'number') throw new Error('Invalid "barsPerLoop" argument');

  var possibles = getPossiblePositions(barsPerLoop, beatsPerBar);
  var all = [];

  events.forEach(function (event) {
    
    var position = event[0];
    if (isPlainPosition(position)) return all.push(event);

    var expressionFn = makeExpressionFunction(position);
    possibles.filter(expressionFn).map(function (possible) {
      var clone = event.slice();
      clone[0] = possible;
      all.push(clone);
    });
  });

  return all.sort(function (a, b) {
    return a < b ? -1 : a > b ? 1 : 0;
  });
}

module.exports = expressions;