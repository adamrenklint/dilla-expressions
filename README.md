# dilla-expressions

[![NPM version](https://badge.fury.io/js/dilla-expressions.png)](http://badge.fury.io/js/dilla-expressions) [![Build Status](https://travis-ci.org/adamrenklint/dilla-expressions.png?branch=master)](https://travis-ci.org/adamrenklint/dilla-expressions) [![Code Climate](https://codeclimate.com/github/adamrenklint/dilla-expressions.png)](https://codeclimate.com/github/adamrenklint/dilla-expressions) [![Test Coverage](https://codeclimate.com/github/adamrenklint/dilla-expressions/badges/coverage.svg)](https://codeclimate.com/github/adamrenklint/dilla-expressions) [![Dependency Status](https://david-dm.org/adamrenklint/dilla-expressions.png?theme=shields.io)](https://david-dm.org/adamrenklint/dilla-expressions)

> expand expressions for repeating notes into flat positions in [dilla](https://github.com/adamrenklint/dilla)

## Install

```
$ npm install --save dilla-expressions
```

## Usage

```javascript
var expr = require('dilla-expressions');

var notes = [
  ['*.even.01']
];

var expanded = expr(notes, {
  'barsPerLoop': 2,
  'beatsPerBar': 4
});

expect(expanded.length).to.equal(4);
expect(expanded[0][0]).to.equal('1.2.01');
expect(expanded[1][0]).to.equal('1.4.01');
expect(expanded[2][0]).to.equal('2.2.01');
expect(expanded[3][0]).to.equal('2.4.01');
```

### Expression operators

- ```*```
- ```even```
- ```odd```

## Custom matchers

It is possible to add a custom *matcher callback*, a function which gets executed for each possible position within the range.

The stack of matchers will continue to execute until a position has been accepted or until the stack ends.

```js
expr.addMatcher(function (position, fragments) {
  if (position === '1.1.45') return true;
  if (fragments[0] === 1 && fragments[2] === 96) return true;
  return false;
});
```

## Develop

- ```make test```
- ```make coverage```
- ```make publish```

## Changelog

- **1.0.0**
  - Initial release with wildcard (```*```), ```even``` and ```odd``` expression operators
- **1.0.1**
  - CHANGED: *events* are now called *notes* [dilla/8](https://github.com/adamrenklint/dilla/issues/8)
- **1.1.0**
  - CHANGED: expects options object instead of barsPerLoop and beatsPerBar separately [#4](https://github.com/adamrenklint/dilla-expressions/issues/4)
  - NEW: possible to add custom matcher callback [#3](https://github.com/adamrenklint/dilla-expressions/issues/3)

## License

MIT © [Adam Renklint](http://adamrenklint.com)
