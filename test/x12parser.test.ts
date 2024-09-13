import { describe, it, expect, vi } from 'vitest';

import { X12parser } from '@/index';
import { createReadStream } from 'node:fs';
import { EventEmitter } from 'node:events';
import { finished } from './test-files/835/profee-done';

describe('X12parser', () => {
  describe('#constructor()', () => {
    const myParser = new X12parser();

    it('Should have a pipe function', () => {
      expect(myParser.pipe).toBeTypeOf('function');
    });

    it('Should return an event emitter', () => {
      expect(myParser).toBeInstanceOf(EventEmitter);
    });
  });

  describe('#detectDelimiters()', () => {
    const isa1 =
      'ISA*00*          *00*          *ZZ*EMEDNYBAT      *ZZ*ETIN           *100101*1000*^*00501*006000600*0*T*:~';
    const isa2 =
      'ISA&00&          &00&          &ZZ&EMEDNYBAT      &ZZ&ETIN           &100101&1000&#&00501&006000600&0&T&@$';
    it('Should be able to auto detect delimiters from ISA', () => {
      expect(X12parser.detectDelimiters(isa1)).toStrictEqual({
        segment: '~',
        component: ':',
        element: '*',
        repetition: '^',
      });

      expect(X12parser.detectDelimiters(isa2)).toStrictEqual({
        segment: '$',
        component: '@',
        element: '&',
        repetition: '#',
      });
    });
  });

  describe('removeDelimiters()', () => {
    const myParser = new X12parser();
    // Pass an initial data w/ GS to detect delimiters
    myParser.write(
      'ISA*00*          *00*          *ZZ*EMEDNYBAT      *ZZ*ETIN           *100101*1000*^*00501*006000600*0*T*:~GS*HP*EMEDNYBAT*ETIN*20100101*1050*6000600*X*005010X221A1~'
    );

    const isa1 =
      '~ISA*00*          *00*          *ZZ*EMEDNYBAT      *ZZ*ETIN           *100101*1000*^*00501*006000600*0*T*:';
    const isa2 =
      'ISA*00*          *00*          *ZZ*EMEDNYBAT      *ZZ*ETIN           *100101*1000*^*00501*006000600*0*T*:~';
    const isa3 =
      '~ISA*00*          *00*          *ZZ*EMEDNYBAT      *ZZ*ETIN           *100101*1000*^*00501*006000600*0*T*:~';

    const delimitersRemoved =
      'ISA*00*          *00*          *ZZ*EMEDNYBAT      *ZZ*ETIN           *100101*1000*^*00501*006000600*0*T*:';

    it('Should remove delimiter from start of string', () => {
      expect(myParser.removeDelimiters(isa1)).toEqual(delimitersRemoved);
    });

    it('Should remove delimiter from end of string', () => {
      expect(myParser.removeDelimiters(isa2)).toBe(delimitersRemoved);
    });

    it('Should remove delimiter from start and end of string', () => {
      expect(myParser.removeDelimiters(isa3)).toBe(delimitersRemoved);
    });
  });

  describe('processChunk()', () => {
    it('Should not error if no items remain in segment array', () => {
      const myParser = new X12parser();
      vi.spyOn(myParser, 'splitSegments').mockImplementationOnce(() => []);

      expect(() => myParser.processChunk('')).not.toThrow();
    });
  });

  describe('835 File Tests', () => {
    it('Should parse files with CRLF', async () =>
      new Promise<void>((done) => {
        const myParser = new X12parser();
        const testFile = createReadStream('./test/test-files/835/profee.edi');
        let counter = 0; // So ugly... This should be done nicer
        testFile.pipe(myParser).on('data', (data) => {
          expect(data).toStrictEqual(finished[counter]);
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
          './test/test-files/835/profee-one-line.edi'
        );
        let counter = 0; // So ugly... This should be done nicer
        testFile.pipe(myParser).on('data', (data) => {
          expect(data).toStrictEqual(finished[counter]);
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
          './test/test-files/835/profee-multiple.edi'
        );
        let counter = 0; // So ugly... This should be done nicer
        let isaCounter = 0; // So ugly... This should be done nicer
        testFile.pipe(myParser).on('data', (data) => {
          if (!finished[counter]) {
            // Super ugly, but resets counter if undefined since it's same ISA just duplicated in file
            counter = 0;
            isaCounter++;
          }

          expect(data).toStrictEqual(finished[counter]);
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
          './test/test-files/835/multi-line-not-delimited.edi'
        );
        let counter = 0; // So ugly... This should be done nicer
        testFile.pipe(myParser).on('data', (data) => {
          expect(data).toStrictEqual(finished[counter]);
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
        const testFile = createReadStream('./test/test-files/835/profee.edi', {
          highWaterMark: 291,
        });
        let counter = 0; // So ugly... This should be done nicer

        testFile.pipe(myParser).on('data', (data) => {
          expect(data).toStrictEqual(finished[counter]);
          counter++;

          // Just hacking this on until full test file refactor
          if (counter === finished.length) {
            done();
          }
        });
      }));
  });
});
