var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');
var sinonChai = require("sinon-chai");
chai.use(sinonChai);

var expr = require('../index');

describe('when events is not defined', function () {
  it('should throw an error', function () {
    expect(function () {
      expr();
    }).to.throw(Error);
  })
});


describe('when options is not defined', function () {
  it('should throw an error', function () {
    expect(function () {
      expr([
        ['1.1.01', 1, {}],
        ['2.4.01', 2, {}]
      ]);
    }).to.throw(Error);
  });
});

describe('when options is an object', function () {
  describe('when options.barsPerLoop is not a number', function () {
    it('should throw an error', function () {
      expect(function () {
        expr([
          ['1.1.01', 1, {}],
          ['2.4.01', 2, {}]
        ], {
          'beatsPerBar': 4
        });
      }).to.throw(Error);
    });
  });
  describe('when options.beatsPerBar is not a number', function () {
    it('should throw an error', function () {
      expect(function () {
        expr([
          ['1.1.01', 1, {}],
          ['2.4.01', 2, {}]
        ], {
          'barsPerLoop': 2,
          'beatsPerBar': 'foo'
        });
      }).to.throw(Error);
    });
  });
});

var standardOptions = {
  'beatsPerBar': 4,
  'barsPerLoop': 2
};

describe('when no expression is used', function () {
  it('should not change normal positions', function () {
    var result = expr([
      ['1.1.01', 1, {}],
      ['2.4.01', 2, {}]
    ], standardOptions);
    expect(result.length).to.equal(2);
    expect(result[0][0]).to.equal('1.1.01');
    expect(result[1][0]).to.equal('2.4.01');
  });
});

describe('when using wildcard expression', function () {

  it('should repeat any bar', function () {
    var result = expr([
      ['*.1.01', 1, { 'freq': 440 }]
    ], standardOptions);
    expect(result.length).to.equal(2);
    expect(result[0][0]).to.equal('1.1.01');
    expect(result[0][1]).to.equal(1);
    expect(result[0][2].freq).to.equal(440);
    expect(result[1][0]).to.equal('2.1.01');
    expect(result[1][1]).to.equal(1);
    expect(result[1][2].freq).to.equal(440);
  });

  it('should repeat any beat', function () {
    var result = expr([
      ['1.*.01']
    ], standardOptions);
    expect(result.length).to.equal(4);
    expect(result[0][0]).to.equal('1.1.01');
    expect(result[1][0]).to.equal('1.2.01');
    expect(result[2][0]).to.equal('1.3.01');
    expect(result[3][0]).to.equal('1.4.01');
  });

  it('should repeat any bar and beat', function () {
    var result = expr([
      ['*.*.01']
    ], {
      'beatsPerBar': 4,
      'barsPerLoop': 4
    });
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

  it('should repeat any tick', function () {
    var result = expr([
      ['1.1.*']
    ], {
      'beatsPerBar': 1,
      'barsPerLoop': 1
    });
    expect(result.length).to.equal(96);
    expect(result[0][0]).to.equal('1.1.01');
    expect(result[95][0]).to.equal('1.1.96');
  });

  it('should repeat any bar, beat and tick', function () {
    var result = expr([
      ['*.*.*']
    ], standardOptions);
    expect(result.length).to.equal(768);
    expect(result[0][0]).to.equal('1.1.01');
    expect(result[96][0]).to.equal('1.2.01');
    expect(result[383][0]).to.equal('1.4.96');
    expect(result[384][0]).to.equal('2.1.01');
  });
});

describe('when using even/odd expression', function () {

  it('should repeat even beats', function () {
    var result = expr([
      ['1.even.10']
    ], standardOptions);
    expect(result.length).to.equal(2);
    expect(result[0][0]).to.equal('1.2.10');
    expect(result[1][0]).to.equal('1.4.10');
  });

  it('should repeat odd beats', function () {
    var result = expr([
      ['1.odd.10']
    ], standardOptions);
    expect(result.length).to.equal(2);
    expect(result[0][0]).to.equal('1.1.10');
    expect(result[1][0]).to.equal('1.3.10');
  });

  it('should repeat even bars and odd beats', function () {
    var result = expr([
      ['even.odd.10']
    ], standardOptions);
    expect(result.length).to.equal(2);
    expect(result[0][0]).to.equal('2.1.10');
    expect(result[1][0]).to.equal('2.3.10');
  });

  it('should repeat odd bars and even beats', function () {
    var result = expr([
      ['odd.even.10']
    ], {
      'beatsPerBar': 6,
      'barsPerLoop': 4
    });
    expect(result.length).to.equal(6);
    expect(result[0][0]).to.equal('1.2.10');
    expect(result[1][0]).to.equal('1.4.10');
    expect(result[2][0]).to.equal('1.6.10');
    expect(result[3][0]).to.equal('3.2.10');
    expect(result[4][0]).to.equal('3.4.10');
    expect(result[5][0]).to.equal('3.6.10');
  });

  it('should repeat even ticks', function () {
    var result = expr([
      ['1.1.even']
    ], {
      'beatsPerBar': 1,
      'barsPerLoop': 1
    });
    expect(result.length).to.equal(48);
    expect(result[0][0]).to.equal('1.1.02');
    expect(result[47][0]).to.equal('1.1.96');
  });

  it('should repeat odd ticks', function () {
    var result = expr([
      ['1.1.odd']
    ], {
      'beatsPerBar': 1,
      'barsPerLoop': 1
    });
    expect(result.length).to.equal(48);
    expect(result[0][0]).to.equal('1.1.01');
    expect(result[47][0]).to.equal('1.1.95');
  });

  it('should repeat even bars, odd beats and ticks', function () {
    var result = expr([
      ['even.odd.odd']
    ], standardOptions);
    expect(result.length).to.equal(96);
    expect(result[0][0]).to.equal('2.1.01');
    expect(result[1][0]).to.equal('2.1.03');
    expect(result[48][0]).to.equal('2.3.01');
    expect(result[95][0]).to.equal('2.3.95');
  });
});

describe('when using modulus expression', function () {
  describe('when no starting point is defined', function () {
    it('should start from 1 and modulate every {n} ticks', function () {
      var result = expr([
        ['1.1.%30']
      ], {
        'beatsPerBar': 1,
        'barsPerLoop': 1
      });
      expect(result.length).to.equal(4);
      expect(result[0][0]).to.equal('1.1.01');
      expect(result[1][0]).to.equal('1.1.31');
      expect(result[2][0]).to.equal('1.1.61');
      expect(result[3][0]).to.equal('1.1.91');
    });

    it('should start from 1 and modulate every {n} beats', function () {
      var result = expr([
        ['1.%3.01']
      ], {
        'beatsPerBar': 4,
        'barsPerLoop': 1
      });
      expect(result.length).to.equal(2);
      expect(result[0][0]).to.equal('1.1.01');
      expect(result[1][0]).to.equal('1.4.01');
    });

    it('should start from 1 and modulate every {n} beats and ticks', function () {
      var result = expr([
        ['1.%3.%30']
      ], {
        'beatsPerBar': 4,
        'barsPerLoop': 1
      });
      expect(result.length).to.equal(8);
      expect(result[0][0]).to.equal('1.1.01');
      expect(result[1][0]).to.equal('1.1.31');
      expect(result[2][0]).to.equal('1.1.61');
      expect(result[3][0]).to.equal('1.1.91');
      expect(result[4][0]).to.equal('1.4.01');
      expect(result[5][0]).to.equal('1.4.31');
      expect(result[6][0]).to.equal('1.4.61');
      expect(result[7][0]).to.equal('1.4.91');
    });
  });

  describe('when a starting point is defined', function () {

    it('should start from it and modulate every {n} ticks', function () {
      var result = expr([
        ['1.1.5%20']
      ], {
        'beatsPerBar': 1,
        'barsPerLoop': 1
      });
      expect(result.length).to.equal(5);
      expect(result[0][0]).to.equal('1.1.05');
      expect(result[1][0]).to.equal('1.1.25');
      expect(result[2][0]).to.equal('1.1.45');
      expect(result[3][0]).to.equal('1.1.65');
      expect(result[4][0]).to.equal('1.1.85');
    });

    it('should start from it and modulate every {n} beats', function () {
      var result = expr([
        ['1.2%2.01']
      ], {
        'beatsPerBar': 4,
        'barsPerLoop': 1
      });
      expect(result.length).to.equal(2);
      expect(result[0][0]).to.equal('1.2.01');
      expect(result[1][0]).to.equal('1.4.01');
    });
    it('should work with modulus 1, i.e. each after offset', function () {
      var result = expr([
        ['1.2%1.01']
      ], {
        'beatsPerBar': 4,
        'barsPerLoop': 1
      });
      expect(result.length).to.equal(3);
      expect(result[0][0]).to.equal('1.2.01');
      expect(result[1][0]).to.equal('1.3.01');
      expect(result[2][0]).to.equal('1.4.01');
    });
  });
});

describe('when using "less than" and "greater than" expressions', function () {

  describe('when only "greater than" is defined', function () {
    it('should exclude less or same values', function () {
      var result = expr([
        ['1.>2.01']
      ], {
        'beatsPerBar': 4,
        'barsPerLoop': 1
      });
      expect(result.length).to.equal(2);
      expect(result[0][0]).to.equal('1.3.01');
      expect(result[1][0]).to.equal('1.4.01');
    })
  });

  describe('when only "less than" is defined', function () {
    it('should exclude greater or same values', function () {
      var result = expr([
        ['1.<3.01']
      ], {
        'beatsPerBar': 4,
        'barsPerLoop': 1
      });
      expect(result.length).to.equal(2);
      expect(result[0][0]).to.equal('1.1.01');
      expect(result[1][0]).to.equal('1.2.01');
    })
  });

  describe('when both expressions are used', function () {
    it('should only match values in between', function () {
      var result = expr([
        ['1.>1<3.01']
      ], {
        'beatsPerBar': 4,
        'barsPerLoop': 1
      });
      expect(result.length).to.equal(1);
      expect(result[0][0]).to.equal('1.2.01');
    })
  });
});

describe('when using mixed expression', function () {

  it('should repeat every bar and even beats', function () {
    var result = expr([
      ['*.even.01']
    ], standardOptions);
    expect(result.length).to.equal(4);
    expect(result[0][0]).to.equal('1.2.01');
    expect(result[1][0]).to.equal('1.4.01');
    expect(result[2][0]).to.equal('2.2.01');
    expect(result[3][0]).to.equal('2.4.01');
  });

  it('should repeat every beat and odd ticks', function () {
    var result = expr([
      ['1.*.odd']
    ], standardOptions);

    expect(result.length).to.equal(192);
    expect(result[0][0]).to.equal('1.1.01');
    expect(result[1][0]).to.equal('1.1.03');
    expect(result[48][0]).to.equal('1.2.01');
    expect(result[95][0]).to.equal('1.2.95');
    expect(result[96][0]).to.equal('1.3.01');
    expect(result[144][0]).to.equal('1.4.01');
    expect(result[191][0]).to.equal('1.4.95');
  });

  describe('when odd is combined with greater than', function () {
    it('should only match odd values above', function () {
      var result = expr([
        ['1.odd>1.01']
      ], {
        'beatsPerBar': 4,
        'barsPerLoop': 1
      });
      expect(result.length).to.equal(1);
      expect(result[0][0]).to.equal('1.3.01');
    })
  });
  describe('when even is combined with less than', function () {
    it('should only match even values below', function () {
      var result = expr([
        ['1.even<4.01']
      ], {
        'beatsPerBar': 4,
        'barsPerLoop': 1
      });
      expect(result.length).to.equal(1);
      expect(result[0][0]).to.equal('1.2.01');
    })
  });

  describe('when modulus is combined with less and greater than', function () {
    it('should only match the modulated values between', function () {
      var result = expr([
        ['1.3%3>4<15.01']
      ], {
        'beatsPerBar': 20,
        'barsPerLoop': 1
      });
      expect(result.length).to.equal(3);
      expect(result[0][0]).to.equal('1.6.01');
      expect(result[1][0]).to.equal('1.9.01');
      expect(result[2][0]).to.equal('1.12.01');
    });
  });
});

describe('options.expander (expander)', function () {
  describe('when expander is a function', function () {
    describe('when expression is plain position', function () {
      it('should not execute the expander', function () {
        var spy = sinon.spy();
        expr([
          ['1.1.1']
        ], {
          beatsPerBar: 4,
          barsPerLoop: 2,
          expander: spy
        });
        expect(spy).not.to.have.been.called;
      });
    });
    describe('when a fragment is expanded by a previous expression', function () {
      it('should not execute the expander for that fragment', function () {
        var spy = sinon.spy();
        expr([
          ['1.1.*']
        ], {
          beatsPerBar: 4,
          barsPerLoop: 2,
          expander: spy
        });
        expect(spy).not.to.have.been.called;
      });
    });
    it('should execute expander for all three fragments', function () {
      var spy = sinon.spy(function (fragment, start, end) {
        return [1];
      });
      expr([
        ['foo.foo.foo']
      ], {
        beatsPerBar: 4,
        barsPerLoop: 2,
        expander: spy
      });
      expect(spy).to.have.been.calledThrice;
    });
    it('should allow expander to add to tree', function () {
      var result = expr([
        ['1.foo.15']
      ], {
        beatsPerBar: 4,
        barsPerLoop: 2,
        expander: function (fragment, start, end) {
          if (fragment === 'foo') {
            return [2];
          }
        }
      });
      expect(result.length).to.equal(1);
      expect(result[0][0]).to.equal('1.2.15');
    });
  });
});

describe('benchmark', function () {
  describe('when adding a single expression', function () {
    it('should not be slow', function () {
      var start = new Date();
      var result = expr([
        ['*.*.*']
      ], standardOptions);
      expect(new Date() - start).to.be.lessThan(2);
    });
  });
  describe('when repeating a single expression', function () {
    it('should not be slow', function () {
      var start = new Date();
      expr([['*.*.*']], standardOptions);
      expr([['*.*.*']], standardOptions);
      expr([['*.*.*']], standardOptions);
      expect(new Date() - start).to.be.lessThan(4);
    });
  });
  describe('when adding a large set of expressions', function () {
    it('should not be slow', function () {
      this.timeout(5000);
      var start = new Date();
      var options = {
        beatsPerBar: 4,
        barsPerLoop: 8
      };
      var drum = [
        ['odd.1.01', 'A01'],
        ['odd.1.51', 'A01'],
        ['odd.1.91', 'A02'],
        ['odd.2.88', 'A01'],
        ['odd.3.75', 'A01'],
        ['odd.3.91', 'A02'],
        ['odd.4.72', 'A01'],
        ['even.1.91', 'A02'],
        ['even.1.51', 'A01'],
        ['even.3.51', 'A01'],
        ['even.3.88', 'A01'],
        ['even.4.03', 'A02']
      ];
      var hihat = [
        ['*.odd.01', 'A03'],
        ['*.even.01', 'A03'],
        ['*.4.53', 'A03']
      ];
      var lead = [
        ['odd.1.01', 'B01'],
        ['odd.4.90', 'B02'],
        ['even.1.52', 'B02']
      ];
      var follow = [
        ['odd.2.05', 'C03'],
        ['odd.2.51', 'C03'],
        ['odd.3.05', 'C03'],
        ['odd.3.51', 'C03'],
        ['odd.3.75', 'C01'],
        ['odd.4.52', 'C01'],
        ['even.2.05', 'C03'],
        ['even.2.50', 'C02'],
        ['even.3.25', 'C01'],
        ['even.4.01', 'C01'],
        ['even.4.75', 'C01']
      ];
      var bass = [
        ['odd.1.01', 'D01'],
        ['odd.2.72', 'D01'],
        ['odd.3.02', 'D01'],
        ['odd.4.01', 'D01'],
        ['odd.4.51', 'D01'],
        ['even.3.51', 'D01'],
        ['even.4.51', 'D01']
      ];
      [drum, hihat, lead, follow, bass].forEach(function (pattern) {
        expr(pattern, options);
      });
      expect(new Date() - start).to.be.lessThan(7);
    });
  });
});
