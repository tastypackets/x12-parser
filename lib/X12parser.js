const { Transform } = require('stream');
const { StringDecoder } = require('string_decoder');
const { Segment } = require('./Segment');

class X12parser extends Transform {
    /**
     * Creates a new X12parser stream
     * @param {string} defaultEncoding The encoding of the file
     */
    constructor(defaultEncoding = 'utf8') {
        super({objectMode: true, defaultEncoding})
        this._decoder = new StringDecoder(defaultEncoding);
        this._firstLine = true;
        this._leftOver = '';
        this._delimiters = {
            segment: '',
            component: '',
            element: '',
            repetition: ''
        }
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
     * @param {*} encoding The encoding of the chunk (e.g. UTF-8)
     * @param {*} cb Callback indicating chunk was processed and ready for next chunk
     */
    _transform(chunk, encoding, cb) {
        chunk = this._decoder.write(chunk);

        this.processChunk(chunk);
        cb();
    }

    /**
     * Creates segment objects and then pushes formatted data in stream
     * @param {*} segments 
     */
    generateSegments(segments) {
        // Generate segments and push data
        segments.forEach(item => {
            const segment = new Segment(item, { ...this._delimiters });
            this.push(segment.formatted);
        })
    }

    /**
     * Attempts to auto detext the file delimiters
     * @param {string} data The first string in the file
     * @throws {error} Throws an error if the delimiters are not valid or do not match in the file
     */
    detectDelmiters(data) {
        this._delimiters = {
            segment: data[105],
            component: data[104],
            element: data[3],
            repetition: data[82]
        }
    }

    /**
     * Checks if there are any delimiters at the start or end of a string
     * @param {string} segment The raw string for from read stream
     * @returns {string} String with delimiters removed
     */
    removeDelimiters(segment) {
        let data = segment;
        if(data[0] === this._segmentDelimiter) {
            data = data.substring(1);
        }
        if(data[data.length] === this._segmentDelimiter) {
            data = data.substring(0, data.length - 1);
        }

        return data;
    }

    /**
     * Splits up a string into an array of segments
     * @param {string} rawString
     */
    splitSegments(rawString) {
        return rawString.split(this._delimiters.segment);
    }

    /**
     * Processes one chuk of an X12 file
     * @param {string} chunk The chunk from a read stream
     */
    processChunk(chunk) {
        // Remove CRLF
        let data = chunk.replace(/\r\n/g, "\n");

        // If this is first line in the file try to set delimiters
        if(this._firstLine) {
            this.detectDelmiters(data);
            this._firstLine = true;
        }

        // Append any data held from last chunk
        data += this._leftOver;

        // Make sure there are not delimiters at start or end of the string
        data = this.removeDelimiters(data);

        // Get segments
        const segments = this.splitSegments(data);

        // Store last segment, it may not be a full segment and should be processed w/ next chunk
        this._leftOver = segments.splice(-1, 1)[0];

        // Generate and push data in stream
        this.generateSegments(segments);
    }
}

exports.X12parser = X12parser;