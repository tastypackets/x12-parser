const { Transform } = require('stream');
const { StringDecoder } = require('string_decoder');
const Segment = require('./Segment');

class X12parser extends Transform {
  /**
   * Creates a new X12parser stream
   * @param {string} defaultEncoding The encoding of the file
   */
  constructor(defaultEncoding = 'ascii') {
    super({ objectMode: true, defaultEncoding });
    this._decoder = new StringDecoder(defaultEncoding);
    this._firstLine = true;
    this._leftOver = '';
    this._delimiters = {
      segment: '',
      component: '',
      element: '',
      repetition: '',
    };
  }

  /**
   * Do not directly use, this is called by readable stream methods when stream has finished
   * @param {function} cb Execute cb when done flushing
   */
  _flush(cb) {
    // Send whatever is left over into generator
    const data = this.splitSegments(this._leftOver);
    this.generateSegments(data);
    cb();
  }

  /**
   * Node API for transform streams
   * @param {object} chunk The next chunk of data from read stream
   * @param {string} encoding The encoding of the chunk (e.g. UTF-8)
   * @param {function} cb Callback indicating chunk was processed and ready for next chunk
   */
  _transform(chunk, encoding, cb) {
    chunk = this._decoder.write(chunk);

    this.processChunk(chunk);
    cb();
  }

  /**
   * Creates segment objects and then pushes formatted data in stream
   * @param {object[]} segments The array of segments to be pushed down the stream
   */
  generateSegments(segments) {
    segments.forEach((item) => {
      const segment = new Segment(item, { ...this._delimiters });
      this.push(segment.formatted);
    });
  }

  /**
   * Attempts to auto detect the file delimiters
   * @param {string} data The first string in the file
   * TODO: Add additional validations here
   */
  static detectDelimiters(data) {
    return {
      segment: data[105],
      component: data[104],
      element: data[3],
      repetition: data[82],
    };
  }

  /**
   * Checks if there are any delimiters at the start or end of a string
   * @param {string} chunk The raw string for from read stream
   * @returns {string} String with delimiters removed
   */
  removeDelimiters(chunk) {
    let data = chunk;
    if (data[0] === this._delimiters.segment) {
      data = data.substring(1);
    }
    if (data[data.length - 1] === this._delimiters.segment) {
      data = data.substring(0, data.length - 1);
    }

    return data;
  }

  /**
   * Splits up a string into an array of segments
   * @param {string} rawString Full segment string from EDI file
   * @returns {string[]} An array of segments
   */
  splitSegments(rawString) {
    // Make sure there are not delimiters at start or end of the string
    const cleanedString = this.removeDelimiters(rawString);
    return cleanedString.split(this._delimiters.segment);
  }

  /**
   * Processes one chunk of an X12 file
   * @param {string} chunk The chunk from a read stream
   */
  processChunk(chunk) {
    // Remove CRLF
    let data = chunk.replace(/\r\n/g, '\n');

    // Append any data held from last chunk
    data = this._leftOver + data;

    // If this is first line in the file try to set delimiters
    if (this._firstLine) {
      this._delimiters = X12parser.detectDelimiters(data);
      this._firstLine = false;
    }

    // Get array segments
    const segments = this.splitSegments(data);

    // Store last segment, it may not be a full segment and should be processed w/ next chunk
    this._leftOver = segments.splice(-1, 1)[0];

    // Add delimiter back if chunk ended with a delimiter
    if (data[data.length - 1] === this._delimiters.segment) {
      this._leftOver += this._delimiters.segment;
    }

    // Generate and push data in stream
    this.generateSegments(segments);
  }
}

module.exports = X12parser;
