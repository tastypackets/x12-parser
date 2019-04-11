const { X12parser } = require('../lib/X12parser');
const assert = require('assert');
const { createReadStream } = require('fs');

describe('X12parser', function () {
  describe('#constructor()', function () {
    const myParser = new X12parser();
    it('Shuld return a X12parser', function () {
      assert(myParser instanceof X12parser);
    });
  });
  describe('#pipe', function () {
    const myParser = new X12parser();
    it('Shuld be able to pipe in data', function () {
      const testFile = createReadStream('./test/testFiles/profee.edi')
      testFile.pipe(myParser).on('data', data => console.log(data))
    });
  });
});