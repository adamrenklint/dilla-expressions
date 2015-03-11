function isPlainPosition (position) {
  return !!position.match(/^\d+\.\d+\.\d+$/);
}

function expressions (events, barsPerLoop, beatsPerBar) {

  if (!events) throw new Error('Invalid events array');
  if (!barsPerLoop || typeof barsPerLoop !== 'number') throw new Error('Invalid "barsPerLoop" argument');
  if (!beatsPerBar || typeof beatsPerBar !== 'number') throw new Error('Invalid "barsPerLoop" argument');

  var all = [];

  events.forEach(function (event) {
    var position = event[0];
    if (isPlainPosition(position)) return all.push(event);
    var fragments = position.split('.');
    // var created = [];
    // fragments.forEach(function (fragment, index) {
    //   var fragNumber = parseInt(fragment, 10);
    //   if (!isNaN(fragNumber)) {
    //     // created
    //   }
    //   console.log(index, fragment, fragNumber, typeof fragNumber, isNaN(fragNumber));
    // });
  });

  console.log(all);
  return all.sort(function (a, b) {
    return a < b ? -1 : a > b ? 1 : 0;
  });
}

module.exports = expressions;