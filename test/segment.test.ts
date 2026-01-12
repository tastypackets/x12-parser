import { describe, it, expect, vi } from 'vitest';

import { Segment } from '@/Segment.js';

describe('Segment', () => {
  const delimiters = {
    segment: '~',
    element: '*',
    component: ':',
    repetition: '^',
  } as const;

  describe('#cleanString()', () => {
    it('Should remove white space & remove new lines', () => {
      // CRLF is already replace in X12 class
      expect(Segment.cleanString('   test   \n    ')).toBe('test');
    });
  });

  describe('#processElement()', () => {
    it('Should return an array of strings, split by the component delimiter', () => {
      //TODO: Remove initial segment when type checking is added
      const mySegment = new Segment('AMT*AU*34.25', delimiters);
      expect(mySegment.processElement('AU')).toStrictEqual([['AU']]);
    });
    it('If ISA component is left in tact, since it is an actual element', () => {
      //TODO: Remove initial segment when type checking is added
      const isa =
        'ISA*00*          *00*          *ZZ*EMEDNYBAT      *ZZ*ETIN           *100101*1000*^*00501*006000600*0*T*:';
      const mySegment = new Segment(isa, delimiters);
      expect(mySegment.processElement(':')).toStrictEqual([[':']]);
    });
    it('Should handle cases where elements are repeated', () => {
      const ras = 'RAS*34.25*1234567890*12345:0^67890:1';
      const mySegment = new Segment(ras, delimiters);
      expect(mySegment.processElement('1234567890')).toStrictEqual([
        ['1234567890'],
      ]);
      expect(mySegment.processElement('12345:0^67890:1')).toStrictEqual([
        ['12345', '0'],
        ['67890', '1'],
      ]);
    });
  });

  describe('get formatted()', () => {
    it('Should still return a string if segment is an empty array', () => {
      const mySegment = new Segment('', delimiters);
      vi.spyOn(mySegment, 'processElement').mockImplementation(() => []);
      mySegment.parseSegment('*');

      expect(mySegment.formatted).toStrictEqual({
        1: '',
        name: '',
      });
    });
  });

  // Class immediatly calls parse, so constructor test was moved below the other method tests
  // To be changed in future update when type testing is added to segment class
  describe('#constructor()', () => {
    const mySegment = new Segment('AMT*AU*34.25', delimiters);
    it('Should parse passed raw element string', () => {
      expect(mySegment.parsed).toStrictEqual([[['AU']], [['34.25']]]);
    });

    it('Should parse out the name of the element', () => {
      expect(mySegment.name).toBe('AMT');
    });
  });

  describe('formatted', () => {
    const mySegment = new Segment('AMT*AU*34.25', delimiters);
    it('Should return an object of elements', () => {
      expect(mySegment.formatted).toStrictEqual({
        name: 'AMT',
        1: 'AU',
        2: '34.25',
      });
    });
    it('Should add repeat index to end if repeated element', () => {
      const ras = 'RAS*34.25*1234567890*12345:0^67890:1';
      const segment = new Segment(ras, delimiters);
      expect(segment.formatted).toStrictEqual({
        name: 'RAS',
        1: '34.25',
        2: '1234567890',
        3: '12345',
        '3-1-1': '0',
        '3-1-2': '67890',
        '3-2-2': '1',
      });
    });
    it('Should add repeat index to if repeated and first is single component', () => {
      const ras = 'RAS*34.25*1234567890*abcde^12345:0^67890:1';
      const segment = new Segment(ras, delimiters);
      expect(segment.formatted).toStrictEqual({
        name: 'RAS',
        1: '34.25',
        2: '1234567890',
        3: 'abcde',
        '3-1-2': '12345',
        '3-2-2': '0',
        '3-1-3': '67890',
        '3-2-3': '1',
      });
    });
    it('Should format normal multi component elements', () => {
      const ras = 'RAS*34.25*1234567890*12345:0:67890:1';
      const segment = new Segment(ras, delimiters);
      expect(segment.formatted).toStrictEqual({
        name: 'RAS',
        1: '34.25',
        2: '1234567890',
        3: '12345',
        '3-1': '0',
        '3-2': '67890',
        '3-3': '1',
      });
    });
  });
});
