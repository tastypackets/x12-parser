export = X12parser;
import type { Transform } from 'stream';
declare class X12parser extends Transform {
  /**
   * Attempts to auto detect the file delimiters
   * @param {string} data The first string in the file
   */
  static detectDelimiters(data: string): {
    segment: string;
    component: string;
    element: string;
    repetition: string;
  };
  /**
   * Creates a new X12parser stream
   * @param {string} defaultEncoding The encoding of the file
   */
  constructor(defaultEncoding?: string);
  _decoder: any;
  _firstLine: boolean;
  _leftOver: string;
  _delimiters: {
    segment: string;
    component: string;
    element: string;
    repetition: string;
  };
  /**
   * Do not directly use, this is called by readable stream methods when stream has finished
   * @param {function} cb Execute cb when done flushing
   */
  _flush(cb: Function): void;
  /**
   * Node API for transform streams
   * @param {object} chunk The next chunk of data from read stream
   * @param {string} encoding The encoding of the chunk (e.g. UTF-8)
   * @param {function} cb Callback indicating chunk was processed and ready for next chunk
   */
  _transform(chunk: object, encoding: string, cb: Function): void;
  /**
   * Creates segment objects and then pushes formatted data in stream
   * @param {object[]} segments The array of segments to be pushed down the stream
   */
  generateSegments(segments: object[]): void;
  /**
   * Checks if there are any delimiters at the start or end of a string
   * @param {string} chunk The raw string for from read stream
   * @returns {string} String with delimiters removed
   */
  removeDelimiters(chunk: string): string;
  /**
   * Splits up a string into an array of segments
   * @param {string} rawString Full segment string from EDI file
   * @returns {string[]} An array of segments
   */
  splitSegments(rawString: string): string[];
  /**
   * Processes one chunk of an X12 file
   * @param {string} chunk The chunk from a read stream
   */
  processChunk(chunk: string): void;
}
