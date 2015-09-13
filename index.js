var memoize = require('meemo');

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

var getFragments = memoize(function  (position) {
  return position.split('.').map(function (fragment) {
    var fragmentNumber = parseInt(fragment, 10);
    if (fragment.match(/^\d+$/) && !isNaN(fragmentNumber)) return fragmentNumber;
    return fragment;
  });
});

var skipInRange = memoize(function (min, end, offset, step) {
  var all = [];
  while (offset <= end) {
    if (offset > min) {
      all.push(offset);
    }
    offset += step;
  }
  return all;
}, serializeArgs);

var getRange = memoize(function (start, end) {
  var all = [];
  var i = start;
  while (i <= end) {
    all.push(i);
    i++;
  }
  return all;
}, hashArgs);

var filterModulus = memoize(function  (range, mod, res) {
  return range.filter(function (n) {
    return n % mod === res;
  });
}, hashArgs);

var gtRe = />(\d+)/;
var ltRe = /<(\d+)/;

function expandToTree (fragment, tree, end, expander) {
  var start = 1;

  if (/^\d+$/.test(fragment)) {
    tree[fragment] = {};
    return;
  }

  var gtMatch = fragment.match(gtRe) || 0;
  if (gtMatch) {
    gtMatch = gtMatch && parseInt(gtMatch[1], 10);
    start = gtMatch + 1;
    fragment = fragment.replace(gtRe, '');
  }

  var ltMatch = fragment.match(ltRe) || 0;
  if (ltMatch) {
    ltMatch = ltMatch && parseInt(ltMatch[1], 10);
    end = ltMatch - 1;
    fragment = fragment.replace(ltRe, '');
  }

  var range = getRange(start, end);

  // start new chain here, in case range was changed by gt/lt
  if (!fragment || fragment === '*') {
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
    var pieces = fragment.split('%');
    var offset = pieces[0] && parseInt(pieces[0], 10) || 1;
    var step = parseInt(pieces[1], 10);
    skipInRange(gtMatch, end, offset, step).forEach(function (n) {
      tree[n] = {};
    });
  }
  else if (typeof expander === 'function') {
    var result = expander(fragment, start, end);
    if (Array.isArray(result)) {
      result.forEach(function (n) {
        tree[n] = {};
      });
    }
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
  });
  return all;
}

var expandExpression = memoize(function (position, bars, beats, expander) {
  var fragments = getFragments(position);
  var tree = {};

  expandToTree(fragments[0], tree, bars, expander);

  Object.keys(tree).forEach(function (bar) {
    expandToTree(fragments[1], tree[bar], beats, expander);

    Object.keys(tree[bar]).forEach(function (beat) {
      expandToTree(fragments[2], tree[bar][beat], 96, expander);
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
    expandExpression(position, options.barsPerLoop, options.beatsPerBar, options.expander).forEach(function (expanded) {
      var clone = event.slice();
      clone[0] = expanded;
      all.push(clone);
    });
  });

  return all;
}

module.exports = expressions;
