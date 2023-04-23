import Segment from '../lib/Segment.js';

describe('Segment', () => {
  const delimiters = {
    segment: '~',
    element: '*',
    component: ':',
    repetition: '^',
  };

  describe('#cleanString()', () => {
    it('Should remove white space & remove new lines', () => {
      // CRLF is already replace in X12 class
      assert.deepEqual(Segment.cleanString('   test   \n    '), 'test');
    });
  });
  describe('#processElement()', () => {
    it('Should return an array of strings, split by the component delimiter', () => {
      //TODO: Remove initial segment when type checking is added
      const mySegment = new Segment('AMT*AU*34.25', delimiters);
      assert.deepEqual(mySegment.processElement('AU'), ['AU']);
    });
    it('If ISA component is left in tact, since it is an actual element', () => {
      //TODO: Remove initial segment when type checking is added
      const isa =
        'ISA*00*          *00*          *ZZ*EMEDNYBAT      *ZZ*ETIN           *100101*1000*^*00501*006000600*0*T*:';
      const mySegment = new Segment(isa, delimiters);
      assert.deepEqual(mySegment.processElement(':'), [':']);
    });
  });
  // Class immediatly calls parse, so constructor test was moved below the other method tests
  // To be changed in future update when type testing is added to segment class
  describe('#constructor()', () => {
    const mySegment = new Segment('AMT*AU*34.25', delimiters);
    it('Should return a Segment', () => {
      assert(mySegment instanceof Segment);
    });
    it('Should parse passed raw element string', () => {
      assert.deepEqual(mySegment.parsed, [['AU'], ['34.25']]);
    });
    it('Should parse out the name of the element', () => {
      assert.strictEqual(mySegment.name, 'AMT');
    });
  });
  describe('formatted', () => {
    const mySegment = new Segment('AMT*AU*34.25', delimiters);
    it('Should return an object of elements', () => {
      assert.deepEqual(mySegment.formatted, {
        name: 'AMT',
        1: 'AU',
        2: '34.25',
      });
    });
  });
});
