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
        possibles.push([bar, beat, displayTick].join('.'));
      }
    }
  }
  return possibles;
}

function getFragments (position) {
  return position.split('.').map(function (fragment) {
    var fragmentNumber = parseInt(fragment, 10);
    if (fragment.match(/^\d+$/) && !isNaN(fragmentNumber)) return fragmentNumber;
    return fragment;
  });
}

var matchers = [];

function addMatcher (matcher) {
  if (!matcher || typeof matcher !== 'function') throw new Error('Invalid argument: matcher is not a function');
  matchers.push(matcher);
}

function makeExpressionFunction (expression) {
  var exprFragments = getFragments(expression);
  // console.log(exprFragments, expression)
  return function expressionFn (position) {
    var positionFragments = getFragments(position);
    var valid = true;
    exprFragments.some(function (exprFragment, index) {
      if (typeof exprFragment === 'number' && positionFragments[index] === exprFragment) return;
      if (exprFragment === 'even' && positionFragments[index] % 2 === 0) return;
      if (exprFragment === 'odd' && positionFragments[index] % 2 === 1) return;
      if (exprFragment === '*') return;

      // console.log('foo', exprFragment, typeof exprFragment);
      if (typeof exprFragment === 'string' && exprFragment.indexOf('%') >= 0) {
        // console.log(exprFragment)

        var nums = exprFragment.split('%');
        var offset = parseInt(nums[0] || 1, 10);
        var mod = parseInt(nums[1], 10);
        var res = (positionFragments[index] - offset) % mod;
        if (!res) return;
      }
      // position is invalid, break out early
      // console.log('>', position, positionFragments);
      valid = false;
      return true;
    });

    var _matchers = matchers.slice();
    var matcher;
    while (!valid && _matchers.length) {
      matcher = _matchers.shift();
      if (matcher(exprFragments, positionFragments)) {
        valid = true;
      }
    }
    return valid;
  };
}

function expressions (notes, options) {

  if (!notes) throw new Error('Invalid "notes" array');
  if (!options || typeof options !== 'object') throw new Error('Invalid "options" object');
  if (typeof options.beatsPerBar !== 'number' || options.beatsPerBar < 0) throw new Error('Invalid options: beatsPerBar is not a valid number');
  if (typeof options.barsPerLoop !== 'number' || options.barsPerLoop < 0) throw new Error('Invalid options: barsPerLoop is not a valid number');

  var possibles = getPossiblePositions(options.barsPerLoop, options.beatsPerBar);
  var all = [];

  notes.forEach(function (event) {

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

expressions.addMatcher = addMatcher;
module.exports = expressions;
