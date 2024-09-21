import { Transform } from 'node:stream';
import { StringDecoder } from 'node:string_decoder';

import { Segment } from '@/Segment.js';
import type { Delimiters } from '@/types.js';

export class X12parser extends Transform {
  #decoder: StringDecoder;
  #firstLine: boolean;
  #leftOver: string;
  #delimiters: Delimiters;

  /**
   * Creates a new X12parser stream
   * @constructor
   * @param defaultEncoding The encoding of the file, defaults to ascii
   */
  constructor(defaultEncoding: BufferEncoding = 'ascii') {
    super({ objectMode: true, defaultEncoding });
    this.#decoder = new StringDecoder(defaultEncoding);
    this.#firstLine = true;
    this.#leftOver = '';
    this.#delimiters = {
      segment: '',
      component: '',
      element: '',
      repetition: '',
    };
  }

  /**
   * Do not directly use, this is called by readable stream methods when stream has finished
   * @param cb Execute cb when done flushing
   */
  _flush(cb: () => void): void {
    // Send whatever is left over into generator
    const data = this.splitSegments(this.#leftOver);
    this.generateSegments(data);
    cb();
  }

  /**
   * Node API for transform streams
   * @param chunk The next chunk of data from read stream
   * @param encoding The encoding of the chunk (e.g. UTF-8)
   * @param cb Callback indicating chunk was processed and ready for next chunk
   */
  _transform(chunk: Buffer, _encoding: string, cb: () => void): void {
    const decodedBuffer = this.#decoder.write(chunk);

    this.processChunk(decodedBuffer);
    cb();
  }

  /**
   * Creates segment objects and then pushes formatted data in stream
   * @param segments The array of segments to be pushed down the stream
   */
  generateSegments(segments: string[]): void {
    segments.forEach((item) => {
      const segment = new Segment(item, this.#delimiters);
      this.push(segment.formatted);
    });
  }

  /**
   * Attempts to auto detect the file delimiters
   * @param data The first string in the file
   * TODO: Add additional validations here
   */
  static detectDelimiters(data: string): Delimiters {
    return {
      segment: data[105],
      component: data[104],
      element: data[3],
      repetition: data[82],
    };
  }

  /**
   * Checks if there are any delimiters at the start or end of a string
   * @param chunk The raw string for from read stream
   */
  removeDelimiters(chunk: string): string {
    let data = chunk;

    // Clean up starting delimiter, e.g. ~1*2~ becomes 1*2~
    if (data[0] === this.#delimiters.segment) {
      data = data.substring(1);
    }

    // Clean up terminating delimiter, e.g. 1*2~ becomes 1*2
    if (data[data.length - 1] === this.#delimiters.segment) {
      data = data.substring(0, data.length - 1);
    }

    return data;
  }

  /**
   * Splits up a string into an array of segments
   * @param rawString Full segment string from EDI file
   */
  splitSegments(rawString: string): string[] {
    const cleanedString = this.removeDelimiters(rawString);
    return cleanedString.split(this.#delimiters.segment);
  }

  /**
   * Processes one chunk of an X12 file
   * @param chunk The string from converting chunk Buffer with StringDecoder
   */
  processChunk(chunk: string) {
    // Remove CRLF
    let data = chunk.replace(/\r\n/g, '\n');

    // Append any data held from last chunk
    data = this.#leftOver + data;

    // If this is first line in the file try to set delimiters
    if (this.#firstLine) {
      this.#delimiters = X12parser.detectDelimiters(data);
      this.#firstLine = false;
    }

    // Get array of segments
    const segments = this.splitSegments(data);

    // Store last segment, it may not be a full segment and should be processed w/ next chunk
    this.#leftOver = segments.pop() ?? '';

    // Add delimiter back if chunk ended with a delimiter
    if (data[data.length - 1] === this.#delimiters.segment) {
      this.#leftOver += this.#delimiters.segment;
    }

    // Generate and push data in stream
    this.generateSegments(segments);
  }
}
