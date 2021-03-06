# dilla-expressions

[![npm](https://img.shields.io/npm/v/dilla-expressions.svg?style=flat-square)](https://www.npmjs.com/package/dilla-expressions) [![npm](https://img.shields.io/npm/dm/dilla-expressions.svg?style=flat-square)](https://www.npmjs.com/package/dilla-expressions) [![GitHub stars](https://img.shields.io/github/stars/adamrenklint/dilla-expressions.svg?style=flat-square)](https://github.com/adamrenklint/dilla-expressions/stargazers) [![GitHub forks](https://img.shields.io/github/forks/adamrenklint/dilla-expressions.svg?style=flat-square)](https://github.com/adamrenklint/dilla-expressions/network)

[![Travis branch](https://img.shields.io/travis/adamrenklint/dilla-expressions.svg?style=flat-square)](https://travis-ci.org/adamrenklint/dilla-expressions) [![Code Climate](https://img.shields.io/codeclimate/github/adamrenklint/dilla-expressions.svg?style=flat-square)](https://codeclimate.com/github/adamrenklint/dilla-expressions) [![Code Climate](https://img.shields.io/codeclimate/coverage/github/adamrenklint/dilla-expressions.svg?style=flat-square)](https://codeclimate.com/github/adamrenklint/dilla-expressions) [![David dependencies](https://img.shields.io/david/adamrenklint/dilla-expressions.svg?style=flat-square)](https://david-dm.org/adamrenklint/dilla-expressions) [![David devDependencies](https://img.shields.io/david/dev/adamrenklint/dilla-expressions.svg?style=flat-square)](https://david-dm.org/adamrenklint/dilla-expressions#info=devDependencies)

> expand expressions for repeating notes into flat positions

Built for and used in [dilla](https://github.com/adamrenklint/dilla) and [bap](http://bapjs.org), by [Adam Renklint](http://adamrenklint.com)

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

## Operators

### Wildcard

```js
> "*.*.32"
= "1.1.32", "1.2.32", "1.3.32", "1.4.32", "2.1.32", "2.2.32", "2.3.32", "2.4.32"
```

### Odd/even

```js
> "1.even.01"
= "1.2.01", "1.4.01"

> "1.odd.01"
= "1.1.01", "1.1.01"
```

### Modulus

```js
> "1.%3.%30"
= "1.1.01", "1.1.31", "1.1.61", "1.1.91", "1.4.01", "1.4.31", "1.4.61", "1.4.91"

> "1.1.5%20"
= "1.1.05", "1.1.25", "1.1.45", "1.1.65", "1.1.85"
```

### Greater than

```js
> "1.>2.01"
= "1.3.01", "1.4.01"
```

### Less than

```js
> "1.<4.01"
= "1.1.01", "1.2.01", "1.3.01"
```

## Custom expander

It is possible to extend dilla-expressions with your own expression expander.

The position is split into three fragments. An expander function will be called for each fragment of the position expression that is not a simple number or already expanded by a previous expander, i.e. wildcard, modulus, etc...

Start and end represent the start and endpoints for the current fragment, and would most times be the same as barsPerLoop, but could be another value if the fragment is combined with the *greater than* or *less than* operators.

```js
var expanded = expr([
  ['foo.bar.baz']
], {
  'barsPerLoop': 2,
  'beatsPerBar': 4,
  'expander': function (fragment, start, end) {
    if (fragment === 'foo') { return [1, 2]; }
    else if (fragment === 'bar') { return [end/2]; }
    else if (fragment === 'baz') { return [15]; }
  }
});

expect(expanded.length).to.equal(2);
expect(expanded[0][0]).to.equal('1.2.15');
expect(expanded[1][0]).to.equal('2.2.15');
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
  - NEW: modulus operator [#1](https://github.com/adamrenklint/dilla-expressions/issues/1)
- **1.1.2**
  - FIXED: ```1.2%1.01``` expression would incorrectly match ```1.1.01```
- **1.2.0**
  - NEW: greater than and less than operators
- **2.0.0**
  - NEW: completely refactored to improve performance
    - Single expression: 23ms to 1ms (23x)
    - Repeated single expression: 77ms to 1ms (77x)
    - Large expression: 4,659ms to 3ms (1,553x)
  - CHANGED: Removed ```expr.addMatcher``` in favor of ```options.expander``` fn for custom expander logic
- **2.1.0**
  - CHANGED: use [meemo](http://github.com/adamrenklint/meemo) for memoization with less allocation and memory churn
- **2.1.1**
  - CHANGED: Use meemo 1.1
- **2.1.2**
  - CHANGED: Use meemoi 1.1.1, fixes issue with referencing window
- **2.1.3**
  - CHANGED: Use meemoi 1.1.2, fixes issue with deoptimized memoization handler

## License

MIT © [Adam Renklint](http://adamrenklint.com)
