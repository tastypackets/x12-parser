const { Transform } = require('stream');
const { StringDecoder } = require('string_decoder');
const { Segment } = require('./Segment');

class X12parser extends Transform {
    /**
     * Creates a new X12parser stream
     * @param {string} defaultEncoding The defauilt encoding of the file
     */
    constructor(defaultEncoding) {
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
    //TODO: Flush need to empty left over

    _transform(chunk, encoding, cb) {
        chunk = this._decoder.write(chunk);

        this.processChunk(chunk);
        cb();
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

        // Attach anything that was held from last string
        data += this._leftOver;

        // Check if first or second charector is the segment delimiter and remove them
        if(data[0] === this._segmentDelimiter) {
            data = data.substring(1);
        }
        if(data[data.length] === this._segmentDelimiter) {
            data = data.substring(0, data.length - 1);
        }

        // Get segments
        const segments = data.split(this._delimiters.segment);

        // Store last segment, it may not be a full segment and should be processed w/ next chunk
        this._leftOver = segments.splice(-1, 1)[0];

        // Generate segments and push data
        segments.forEach(segment => {
            const seg = new Segment(segment, {...this._delimiters});
            this.push(seg.formatted);
        })
    }
}

exports.X12parser = X12parser;