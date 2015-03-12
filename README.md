# dilla-expressions

[![NPM version](https://badge.fury.io/js/dilla-expressions.png)](http://badge.fury.io/js/dilla-expressions) [![Build Status](https://travis-ci.org/adamrenklint/dilla-expressions.png?branch=master)](https://travis-ci.org/adamrenklint/dilla-expressions) [![Code Climate](https://codeclimate.com/github/adamrenklint/dilla-expressions.png)](https://codeclimate.com/github/adamrenklint/dilla-expressions) [![Dependency Status](https://david-dm.org/adamrenklint/dilla-expressions.png?theme=shields.io)](https://david-dm.org/adamrenklint/dilla-expressions)

> expand expressions for repeating notes into flat positions in [dilla](https://github.com/adamrenklint/dilla)

## Install

```
$ npm install --save dilla-expressions
```

## Usage

```javascript
var expr = require('dilla-expressions');
var barsPerLoop = 2;
var beatsPerBar = 4;

var notes = [
  ['*.even.01']
];

var expanded = expr(notes, barsPerLoop, beatsPerBar);

expect(result.length).to.equal(4);
expect(result[0][0]).to.equal('1.2.01');
expect(result[1][0]).to.equal('1.4.01');
expect(result[2][0]).to.equal('2.2.01');
expect(result[3][0]).to.equal('2.4.01');
```

### Expression operators

- ```*```
- ```even```
- ```odd```

## Changelog

- **1.0.0**
  - Initial release with wildcard (```*```), ```even``` and ```odd``` expression operators
- **1.0.1**
  - CHANGED: *events* are now called *notes* [dilla/8](https://github.com/adamrenklint/dilla/issues/8)

## License

MIT © [Adam Renklint](http://adamrenklint.com)