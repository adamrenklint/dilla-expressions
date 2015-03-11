var chai = require('chai');
var expect = chai.expect;
var expr = require('../index');

describe('when events is not defined', function () {
  it('should throw an error', function () {
    expect(function () {
      expr();
    }).to.throw(Error);
  })
});

describe('when barsPerLoop is not defined', function () {
  it('should throw an error', function () {
    expect(function () {
      expr([
        ['1.1.01', 1, 440],
        ['2.4.01', 2, 330]
      ]);
    }).to.throw(Error);
  })
});

describe('when beatsPerBar is not defined', function () {
  it('should throw an error', function () {
    expect(function () {
      expr([
        ['1.1.01', 1, 440],
        ['2.4.01', 2, 330]
      ], 2);
    }).to.throw('')
  })
});

describe('when no expressions are used', function () {
  it('should not change normal positions', function () {
    var result = expr([
      ['1.1.01', 1, 440],
      ['2.4.01', 2, 330]
    ], 2, 4);
    expect(result.length).to.equal(2);
    expect(result[0][0]).to.equal('1.1.01');
    expect(result[1][0]).to.equal('2.4.01');
  });
});

describe('wildcard', function () {

  it('should repeat every bar', function () {
    var result = expr([
      ['*.1.01', 1, 440]
    ], 2, 4);
    expect(result.length).to.equal(2);
    expect(result[0][0]).to.equal('1.1.01');
    expect(result[0][1]).to.equal(1);
    expect(result[0][2]).to.equal(440);
    expect(result[1][0]).to.equal('2.1.01');
    expect(result[1][1]).to.equal(1);
    expect(result[1][2]).to.equal(440);
  });

  it('should repeat every beat', function () {
    var result = expr([
      ['1.*.01']
    ], 2, 4);
    expect(result.length).to.equal(4);
    expect(result[0][0]).to.equal('1.1.01');
    expect(result[1][0]).to.equal('1.2.01');
    expect(result[2][0]).to.equal('1.3.01');
    expect(result[3][0]).to.equal('1.4.01');
  });

  it('should repeat every bar and beat', function () {
    var result = expr([
      ['*.*.01']
    ], 4, 4);
    expect(result.length).to.equal(16);
    expect(result[0][0]).to.equal('1.1.01');
    expect(result[1][0]).to.equal('1.2.01');
    expect(result[2][0]).to.equal('1.3.01');
    expect(result[3][0]).to.equal('1.4.01');
    expect(result[4][0]).to.equal('2.1.01');
    expect(result[5][0]).to.equal('2.2.01');
    expect(result[6][0]).to.equal('2.3.01');
    expect(result[7][0]).to.equal('2.4.01');
    expect(result[8][0]).to.equal('3.1.01');
    expect(result[9][0]).to.equal('3.2.01');
    expect(result[10][0]).to.equal('3.3.01');
    expect(result[11][0]).to.equal('3.4.01');
    expect(result[12][0]).to.equal('4.1.01');
    expect(result[13][0]).to.equal('4.2.01');
    expect(result[14][0]).to.equal('4.3.01');
    expect(result[15][0]).to.equal('4.4.01');
  });
});