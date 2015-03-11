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

describe('when no expression is used', function () {
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

describe('when using wildcard expression', function () {

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

  return;

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

  it('should repeat every tick', function () {
    var result = expr([
      ['1.1.*']
    ], 1, 1);
    expect(result.length).to.equal(96);
    expect(result[0][0]).to.equal('1.1.01');
    expect(result[95][0]).to.equal('1.1.96');
  });

  it('should repeat every bar, beat and tick', function () {
    var result = expr([
      ['*.*.*']
    ], 2, 4);
    expect(result.length).to.equal(768);
    expect(result[0][0]).to.equal('1.1.01');
    expect(result[96][0]).to.equal('1.2.01');
    expect(result[383][0]).to.equal('1.4.96');
    expect(result[384][0]).to.equal('2.1.01');
  });
});
return;
xdescribe('when using even/odd expression', function () {

  it('should repeat even bars', function () {
    var result = expr([
      ['even.2.45']
    ], 4, 4);
    expect(result.length).to.equal(2);
    expect(result[0][0]).to.equal('2.2.45');
    expect(result[1][0]).to.equal('4.2.45');
  });

  it('should repeat odd bars', function () {
    var result = expr([
      ['odd.1.25']
    ], 8, 4);
    expect(result.length).to.equal(4);
    expect(result[0][0]).to.equal('1.1.25');
    expect(result[1][0]).to.equal('3.1.25');
    expect(result[2][0]).to.equal('5.1.25');
    expect(result[3][0]).to.equal('7.1.25');
  });

  it('should repeat even beats', function () {
    var result = expr([
      ['1.even.10']
    ], 2, 4);
    expect(result.length).to.equal(2);
    expect(result[0][0]).to.equal('1.2.10');
    expect(result[1][0]).to.equal('1.4.10');
  });

  it('should repeat odd beats', function () {
    var result = expr([
      ['1.odd.10']
    ], 2, 4);
    expect(result.length).to.equal(2);
    expect(result[0][0]).to.equal('1.1.10');
    expect(result[1][0]).to.equal('1.3.10');
  });

  it('should repeat even bars and odd beats', function () {
    var result = expr([
      ['even.odd.10']
    ], 2, 4);
    expect(result.length).to.equal(2);
    expect(result[0][0]).to.equal('2.1.10');
    expect(result[1][0]).to.equal('2.3.10');
  });

  it('should repeat odd bars and even beats', function () {
    var result = expr([
      ['odd.even.10']
    ], 4, 6);
    expect(result.length).to.equal(2);
    expect(result[0][0]).to.equal('1.2.10');
    expect(result[1][0]).to.equal('1.4.10');
    expect(result[2][0]).to.equal('1.6.10');
    expect(result[4][0]).to.equal('3.2.10');
    expect(result[5][0]).to.equal('3.4.10');
    expect(result[6][0]).to.equal('3.6.10');
  });

  it('should repeat even ticks', function () {
    var result = expr([
      ['1.1.even']
    ], 1, 1);
    expect(result.length).to.equal(48);
    expect(result[0][0]).to.equal('1.1.2');
    expect(result[47][0]).to.equal('1.1.96');
  });

  it('should repeat odd ticks', function () {
    var result = expr([
      ['1.1.odd']
    ], 1, 1);
    expect(result.length).to.equal(48);
    expect(result[0][0]).to.equal('1.1.1');
    expect(result[47][0]).to.equal('1.1.95');
  });

  it('should repeat even bars, odd beats and ticks', function () {
    var result = expr([
      ['even.odd.odd']
    ], 2, 4);
    expect(result.length).to.equal(96);
    expect(result[0][0]).to.equal('2.1.1');
    expect(result[1][0]).to.equal('2.1.3');
    expect(result[48][0]).to.equal('2.3.1');
    expect(result[95][0]).to.equal('2.3.95');
  });
});

// describe('when using modulus expression', function () {

//   describe('when no starting point is defined', function () {
//     it('should start from 1 and repeat every {n} ticks', function () {
//       var result = expr([
//         ['1.1.%30']
//       ], 1, 1);
//       expect(result.length).to.equal(4);
//       expect(result[0][0]).to.equal('1.1.01');
//       expect(result[1][0]).to.equal('1.1.31');
//       expect(result[2][0]).to.equal('1.1.61');
//       expect(result[3][0]).to.equal('1.1.91');
//     });

//     it('should start from 1 and repeat every {n} beats', function () {
//       var result = expr([
//         ['1.%3.01']
//       ], 1, 4);
//       expect(result.length).to.equal(2);
//       expect(result[0][0]).to.equal('1.1.01');
//       expect(result[1][0]).to.equal('1.4.01');
//     });

//     it('should start from 1 and repeat every {n} beats and ticks', function () {
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

//     it('should start from it and repeat every {n} ticks', function () {
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

//     it('should start from it and repeat every {n} beats', function () {
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

xdescribe('when using mixed expression', function () {

  /*
    what about duplicates, should they be magically removed?
    probably not...
  */

  it('should repeat every bar and even beats', function () {
    var result = expr([
      ['*.odd.01']
    ], 2, 4);
    expect(result.length).to.equal(4);
    expect(result[0][0]).to.equal('1.2.1');
    expect(result[1][0]).to.equal('1.4.1');
    expect(result[2][0]).to.equal('2.2.1');
    expect(result[3][0]).to.equal('2.4.1');
  });

  it('should repeat every beat and odd ticks', function () {
    var result = expr([
      ['1.*.odd']
    ], 2, 4);
    expect(result.length).to.equal(192);
    expect(result[0][0]).to.equal('1.1.1');
    expect(result[2][0]).to.equal('1.1.3');
    expect(result[48][0]).to.equal('1.2.1');
    expect(result[95][0]).to.equal('1.2.95');
    expect(result[96][0]).to.equal('1.4.1');
    expect(result[192][0]).to.equal('1.4.95');
  });

  // it('should repeat odd bars, every beat and every {n} ticks', function () {
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