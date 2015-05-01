var memoize = require('lodash.memoize');

function hashArgs () {
  return [].slice.call(arguments).join('//');
}
function serializeArgs () {
  return [].slice.call(arguments).map(function (arg) {
    return typeof arg === 'object' ? JSON.stringify(arg) : arg;
  }).join('//');
}

var isPlainPosition = memoize(function (position) {
  return !!position.match(/^\d+\.\d+\.\d+$/);
});

// var getPossiblePositions = memoize(function (barsPerLoop, beatsPerBar) {
//   var possibles = [];
//   var bar = 0, beat, tick, displayTick;
//   while (++bar <= barsPerLoop) {
//     beat = 0;
//     while (++beat <= beatsPerBar) {
//       tick = 0;
//       while (++tick <= 96) {
//         displayTick = tick < 10 ? '0' + tick : tick;
//         possibles.push([bar, beat, displayTick].join('.'));
//       }
//     }
//   }
//   return possibles;
// }, hashArgs);

var getFragments = memoize(function  (position) {
  return position.split('.').map(function (fragment) {
    var fragmentNumber = parseInt(fragment, 10);
    if (fragment.match(/^\d+$/) && !isNaN(fragmentNumber)) return fragmentNumber;
    return fragment;
  });
});

// var matchers = [];

// function addMatcher (matcher) {
//   if (!matcher || typeof matcher !== 'function') throw new Error('Invalid argument: matcher is not a function');
//   matchers.push(matcher);
// }

// var gtRe = />(\d+)/;
// var ltRe = /<(\d+)/;
// var plain
//
// var makeExpressionFunction = memoize(function  (expression) {
//   var exprFragments = getFragments(expression);
//   return memoize(function (position) {
//     var positionFragments = getFragments(position);
//     var valid = true;
//     exprFragments.some(function (exprFragment, index) {
//       if (typeof exprFragment === 'number' && positionFragments[index] === exprFragment) return;
//       // console.log('>', positionFragments[index], index, exprFragment);
//       exprFragment = '' + exprFragment;
//
//       if (ltRe.test(exprFragment)) {
//         var ltVal = exprFragment.match(ltRe)[1];
//         exprFragment = exprFragment.replace(ltRe, '') || '*';
//         if (positionFragments[index] >= ltVal) {
//           valid = false;
//           return true;
//         }
//       }
//
//       if (gtRe.test(exprFragment)) {
//         var gtVal = exprFragment.match(gtRe)[1];
//         exprFragment = exprFragment.replace(gtRe, '') || '*';
//         if (positionFragments[index] <= gtVal) {
//           valid = false;
//           return true;
//         }
//       }
//
//       if (exprFragment === 'even' && positionFragments[index] % 2 === 0) return;
//       if (exprFragment === 'odd' && positionFragments[index] % 2 === 1) return;
//       if (exprFragment === '*') return;
//
//       if (typeof exprFragment === 'string' && exprFragment.indexOf('%') >= 0) {
//         var nums = exprFragment.split('%');
//         var offset = parseInt(nums[0] || 1, 10);
//         var mod = parseInt(nums[1], 10);
//         var value = positionFragments[index] - offset;
//         if (mod === 1) {
//           if (value >= 0) return;
//         }
//         else {
//           var res = value % mod;
//           if (!res) return;
//         }
//       }
//       // position is invalid, break out early
//       valid = false;
//       return true;
//     });
//
//     var _matchers = matchers.slice();
//     var matcher;
//     while (!valid && _matchers.length) {
//       matcher = _matchers.shift();
//       if (matcher(exprFragments, positionFragments)) {
//         valid = true;
//       }
//     }
//     return valid;
//   });
// });

var skipInRange = memoize(function (limit, offset, step) {
  var all = [];
  while (offset <= limit) {
    all.push(offset);
    offset += step;
  }
  return all;
}, serializeArgs);

var getRange = memoize(function (limit) {
  var all = [];
  var i = 0;
  while (i++ < limit) {
    all.push(i);
  }
  return all;
}, hashArgs);

var filterModulus = memoize(function  (range, mod, res) {
  return range.filter(function (n) {
    return n % mod === res;
  });
}, hashArgs);

function expandToTree (fragment, tree, limit) {
  var range = getRange(limit);
  if (/^\d+$/.test(fragment)) {
    tree[fragment] = {};
  }
  else if (fragment === '*') {
    range.forEach(function (n) {
      tree[n] = {};
    });
  }
  else if (fragment === 'odd' || fragment === 'even') {
    var rest = fragment === 'even' ? 0 : 1;
    filterModulus(range, 2, rest).forEach(function (n) {
      tree[n] = {};
    });
  }
  else if (typeof fragment === 'string' && ~fragment.indexOf('%')) {
    var pieces = fragment.split('%')
    var offset = pieces[0] && parseInt(pieces[0], 10) || 1;
    var step = parseInt(pieces[1], 10);
    skipInRange(limit, offset, step).forEach(function (n) {
      tree[n] = {};
    });
  }
}

function flattenTree (tree) {
  var all = [];
  Object.keys(tree).forEach(function (bar) {
    Object.keys(tree[bar]).forEach(function (beat) {
      Object.keys(tree[bar][beat]).forEach(function (tick) {
        tick = tick < 10 ? '0' + tick : tick;
        all.push([bar, beat, tick].join('.'));
      });
    });
  })
  return all;
}

var expandExpression = memoize(function (position, bars, beats) {
  var fragments = getFragments(position);
  var tree = {};

  expandToTree(fragments[0], tree, bars);

  Object.keys(tree).forEach(function (bar) {
    expandToTree(fragments[1], tree[bar], beats);

    Object.keys(tree[bar]).forEach(function (beat) {
      expandToTree(fragments[2], tree[bar][beat], 96);
    });
  });

  return flattenTree(tree);
}, hashArgs);

function expressions (notes, options) {

  if (!notes) throw new Error('Invalid "notes" array');
  if (!options || typeof options !== 'object') throw new Error('Invalid "options" object');
  if (typeof options.beatsPerBar !== 'number' || options.beatsPerBar < 0) throw new Error('Invalid options: beatsPerBar is not a valid number');
  if (typeof options.barsPerLoop !== 'number' || options.barsPerLoop < 0) throw new Error('Invalid options: barsPerLoop is not a valid number');

  var all = [];

  notes.forEach(function (event) {

    var position = event[0];
    if (isPlainPosition(position)) return all.push(event);
    expandExpression(position, options.barsPerLoop, options.beatsPerBar).forEach(function (expanded) {
      var clone = event.slice();
      clone[0] = expanded;
      all.push(clone);
    });
  });

  return all;
  // return sort(all);
  // return all.sort(function (a, b) {
  //   return a < b ? -1 : a > b ? 1 : 0;
  // });
}

module.exports = expressions;
