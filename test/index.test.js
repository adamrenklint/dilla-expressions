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

  it('should repeat even bars', function () {
    var result = expr([
      ['even.2.45']
    ], {
      'beatsPerBar': 4,
      'barsPerLoop': 4
    });
    expect(result.length).to.equal(2);
    expect(result[0][0]).to.equal('2.2.45');
    expect(result[1][0]).to.equal('4.2.45');
  });

  it('should repeat odd bars', function () {
    var result = expr([
      ['odd.1.25']
    ], {
      'beatsPerBar': 4,
      'barsPerLoop': 8
    });
    expect(result.length).to.equal(4);
    expect(result[0][0]).to.equal('1.1.25');
    expect(result[1][0]).to.equal('3.1.25');
    expect(result[2][0]).to.equal('5.1.25');
    expect(result[3][0]).to.equal('7.1.25');
  });

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

// describe('when using modulus expression', function () {

//   describe('when no starting point is defined', function () {
//     it('should start from 1 and modulate every {n} ticks', function () {
//       var result = expr([
//         ['1.1.%30']
//       ], 1, 1);
//       expect(result.length).to.equal(4);
//       expect(result[0][0]).to.equal('1.1.01');
//       expect(result[1][0]).to.equal('1.1.31');
//       expect(result[2][0]).to.equal('1.1.61');
//       expect(result[3][0]).to.equal('1.1.91');
//     });

//     it('should start from 1 and modulate every {n} beats', function () {
//       var result = expr([
//         ['1.%3.01']
//       ], 1, 4);
//       expect(result.length).to.equal(2);
//       expect(result[0][0]).to.equal('1.1.01');
//       expect(result[1][0]).to.equal('1.4.01');
//     });

//     it('should start from 1 and modulate every {n} beats and ticks', function () {
//       var result = expr([
//         ['1.%3.%30']
//       ], 1, 4);
//       expect(result.length).to.equal(28);
//       expect(result[0][0]).to.equal('1.1.01');
//       expect(result[1][0]).to.equal('1.1.31');
//       expect(result[2][0]).to.equal('1.1.61');
//       expect(result[3][0]).to.equal('1.1.91');
//       expect(result[4][0]).to.equal('1.4.01');
//       expect(result[5][0]).to.equal('1.4.31');
//       expect(result[6][0]).to.equal('1.4.61');
//       expect(result[7][0]).to.equal('1.4.91');
//     });
//   });

//   describe('when a starting point is defined', function () {

//     it('should start from it and modulate every {n} ticks', function () {
//       var result = expr([
//         ['1.1.5%20']
//       ], 1, 1);
//       expect(result.length).to.equal(5);
//       expect(result[0][0]).to.equal('1.1.5');
//       expect(result[1][0]).to.equal('1.1.25');
//       expect(result[2][0]).to.equal('1.1.45');
//       expect(result[3][0]).to.equal('1.1.65');
//       expect(result[4][0]).to.equal('1.1.85');
//     });

//     it('should start from it and modulate every {n} beats', function () {
//       var result = expr([
//         ['1.2%3.01']
//       ], 1, 12);
//       expect(result.length).to.equal(4);
//       expect(result[0][0]).to.equal('1.2.01');
//       expect(result[1][0]).to.equal('1.5.01');
//       expect(result[2][0]).to.equal('1.8.01');
//       expect(result[3][0]).to.equal('1.11.01');
//     });
//   });
// });

/*

1.1.>40
,2,4

  = 1.1.1, 1.1.41, 1.1.81, 1.2.05, 1.2.45...

*/

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

  // it('should repeat odd bars, every beat and modulate every {n} ticks', function () {
  //   var result = expr([
  //     ['odd.*.%30']
  //   ], 2, 2);
  //   expect(result.length).to.equal(8);
  //   expect(result[0][0]).to.equal('1.1.1');
  //   expect(result[1][0]).to.equal('1.1.31');
  //   expect(result[2][0]).to.equal('1.1.61');
  //   expect(result[3][0]).to.equal('1.1.91');
  //   expect(result[4][0]).to.equal('1.2.1');
  //   expect(result[5][0]).to.equal('1.2.31');
  //   expect(result[6][0]).to.equal('1.2.61');
  //   expect(result[7][0]).to.equal('1.2.91');
  // });
});
