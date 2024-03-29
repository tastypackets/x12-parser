import { X12parser } from '../lib/index.js';
import { createReadStream } from 'node:fs';
// @ts-expect-error
import { finished } from './testFiles/835/profee-done';

describe('X12parser', () => {
  describe('#constructor()', () => {
    const myParser = new X12parser();

    it('Should return an X12parser', () => {
      assert(myParser instanceof X12parser);
    });

    it('Should have a pipe function', () => {
      assert.strictEqual(typeof myParser.pipe, 'function');
    });

    it('Should return an event emitter', () => {
      assert(myParser instanceof require('events').EventEmitter);
    });
  });

  describe('#detectDelimiters()', () => {
    const isa1 =
      'ISA*00*          *00*          *ZZ*EMEDNYBAT      *ZZ*ETIN           *100101*1000*^*00501*006000600*0*T*:~';
    const isa2 =
      'ISA&00&          &00&          &ZZ&EMEDNYBAT      &ZZ&ETIN           &100101&1000&#&00501&006000600&0&T&@$';
    it('Should be abl to auto detect delimiters from ISA', () => {
      assert.deepEqual(X12parser.detectDelimiters(isa1), {
        segment: '~',
        component: ':',
        element: '*',
        repetition: '^',
      });
      assert.deepEqual(X12parser.detectDelimiters(isa2), {
        segment: '$',
        component: '@',
        element: '&',
        repetition: '#',
      });
    });
  });

  describe('removeDelimiters()', () => {
    const myParser = new X12parser();
    myParser._delimiters = {
      segment: '~',
      component: ':',
      element: '*',
      repetition: '^',
    };
    const isa1 =
      '~ISA*00*          *00*          *ZZ*EMEDNYBAT      *ZZ*ETIN           *100101*1000*^*00501*006000600*0*T*:';
    const isa2 =
      'ISA*00*          *00*          *ZZ*EMEDNYBAT      *ZZ*ETIN           *100101*1000*^*00501*006000600*0*T*:~';
    const isa3 =
      '~ISA*00*          *00*          *ZZ*EMEDNYBAT      *ZZ*ETIN           *100101*1000*^*00501*006000600*0*T*:~';

    const delimitersRemoved =
      'ISA*00*          *00*          *ZZ*EMEDNYBAT      *ZZ*ETIN           *100101*1000*^*00501*006000600*0*T*:';

    it('Should remove delimiter from start of string', () => {
      assert.deepEqual(myParser.removeDelimiters(isa1), delimitersRemoved);
    });

    it('Should remove delimiter from end of string', () => {
      assert.deepEqual(myParser.removeDelimiters(isa2), delimitersRemoved);
    });

    it('Should remove delimiter from start and end of string', () => {
      assert.deepEqual(myParser.removeDelimiters(isa3), delimitersRemoved);
    });
  });

  describe('835 File Tests', () => {
    it('Should parse files with CRLF', async () =>
      new Promise<void>((done) => {
        const myParser = new X12parser();
        const testFile = createReadStream('./test/testFiles/835/profee.edi');
        let counter = 0; // So ugly... This should be done nicer
        testFile.pipe(myParser).on('data', (data) => {
          assert.deepStrictEqual(data, finished[counter]);
          counter++;

          // Just hacking this on until full test file refactor
          if (counter === finished.length) {
            done();
          }
        });
      }));

    it('Should parse single line files', async () =>
      new Promise<void>((done) => {
        const myParser = new X12parser();
        const testFile = createReadStream(
          './test/testFiles/835/profeeOneLine.edi'
        );
        let counter = 0; // So ugly... This should be done nicer
        testFile.pipe(myParser).on('data', (data) => {
          assert.deepStrictEqual(data, finished[counter]);
          counter++;

          // Just hacking this on until full test file refactor
          if (counter === finished.length) {
            done();
          }
        });
      }));

    it('Should parse multiple transactions (ISA) in a single file', async () =>
      new Promise<void>((done) => {
        const myParser = new X12parser();
        const testFile = createReadStream(
          './test/testFiles/835/profeeMultiple.edi'
        );
        let counter = 0; // So ugly... This should be done nicer
        let isaCounter = 0; // So ugly... This should be done nicer
        testFile.pipe(myParser).on('data', (data) => {
          if (!finished[counter]) {
            // Super ugly, but resets counter if undefined since it's same ISA just duplicated in file
            counter = 0;
            isaCounter++;
          }

          assert.deepStrictEqual(data, finished[counter]);
          counter++;

          // Just hacking this on until full test file refactor
          if (counter === finished.length && isaCounter === 155) {
            done();
          }
        });
      }));

    it('Should parse multiline files without delimiter (LF/CRLF is delimiter)', async () =>
      new Promise<void>((done) => {
        const myParser = new X12parser();
        const testFile = createReadStream(
          './test/testFiles/835/multiLineNotDelimited.edi'
        );
        let counter = 0; // So ugly... This should be done nicer
        testFile.pipe(myParser).on('data', (data) => {
          assert.deepStrictEqual(data, finished[counter]);
          counter++;

          // Just hacking this on until full test file refactor
          if (counter === finished.length) {
            done();
          }
        });
      }));
  });

  // Tests added for patches / bug fixes
  describe('Patch tests', () => {
    it('Should parse correctly when segment aligns with chunk size', async () =>
      new Promise<void>((done) => {
        const myParser = new X12parser();
        const testFile = createReadStream('./test/testFiles/835/profee.edi', {
          highWaterMark: 291,
        });
        let counter = 0; // So ugly... This should be done nicer

        testFile.pipe(myParser).on('data', (data) => {
          assert.deepStrictEqual(data, finished[counter]);
          counter++;

          // Just hacking this on until full test file refactor
          if (counter === finished.length) {
            done();
          }
        });
      }));
  });
});
