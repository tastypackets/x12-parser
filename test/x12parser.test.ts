import { describe, it, expect, vi } from 'vitest';

import { X12parser } from '@/index.js';
import { createReadStream } from 'node:fs';
import { EventEmitter } from 'node:events';
import { finished } from './test-files/835/profee-done.js';

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
    it('Should parse files with CRLF', async () => {
      const myParser = new X12parser();
      const testFile = createReadStream('./test/test-files/835/profee.edi');

      const results = [];
      const stream = testFile.pipe(myParser);

      for await (const data of stream) {
        results.push(data);
      }

      expect(results).toStrictEqual(finished);
    });

    it('Should parse single line files', async () => {
      const myParser = new X12parser();
      const testFile = createReadStream(
        './test/test-files/835/profee-one-line.edi'
      );

      const results = [];
      const stream = testFile.pipe(myParser);

      for await (const data of stream) {
        results.push(data);
      }

      expect(results).toStrictEqual(finished);
    });

    it('Should parse multiple transactions (ISA) in a single file', async () => {
      const myParser = new X12parser();
      const testFile = createReadStream(
        './test/test-files/835/profee-multiple.edi'
      );

      const results = [];
      const stream = testFile.pipe(myParser);

      for await (const data of stream) {
        results.push(data);
      }

      // The file contains multiple ISA transactions, so we expect multiple copies of the finished data
      // Based on the original test, there should be 156 complete transactions (isaCounter === 155 + 1)
      const expectedResults = [];
      for (let i = 0; i < 156; i++) {
        expectedResults.push(...finished);
      }

      expect(results).toStrictEqual(expectedResults);
    });

    it('Should parse multiline files without delimiter (LF/CRLF is delimiter)', async () => {
      const myParser = new X12parser();
      const testFile = createReadStream(
        './test/test-files/835/multi-line-not-delimited.edi'
      );

      const results = [];
      const stream = testFile.pipe(myParser);

      for await (const data of stream) {
        results.push(data);
      }

      expect(results).toStrictEqual(finished);
    });
  });

  // Tests added for patches / bug fixes
  describe('Patch tests', () => {
    // Use 'it' (or 'test') and declare the function as `async`.
    // The test runner will automatically wait for the promise to resolve.
    it('Should parse correctly when segment aligns with chunk size', async () => {
      const myParser = new X12parser();
      const testFile = createReadStream('./test/test-files/835/profee.edi', {
        highWaterMark: 291,
      });

      // This array will collect all the data emitted by the parser.
      const results = [];
      const stream = testFile.pipe(myParser);

      // The for-await-of loop consumes the stream until it's finished.
      for await (const data of stream) {
        results.push(data);
      }

      // After the loop, the stream has ended. Now, we can assert
      // that the collected data matches the expected output.
      expect(results).toStrictEqual(finished);
    });
  });
});
