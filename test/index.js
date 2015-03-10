var chai = require('chai');
var expect = chai.expect;
var expr = require('../index');

it('should not change normal positions', function () {
  var result = expr([
    ['1.1.01', 1, 440],
    ['2.4.01', 2, 330]
  ]);
  expect(result.length).to.equal(2);
  expect(result[0][0]).to.equal('1.1.01');
  expect(result[1][0]).to.equal('2.4.01');
});