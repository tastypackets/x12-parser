const { Transform } = require('stream');

class X12parser extends Transform {
    /**
     * Creates a new Validator stream
     * @param {object} schema A custom schema to use instead of attempting to auto use ST indication
     */
    constructor(schema = null) {
        super({objectMode: true})
        this._schema = schema;
    }

    /**
     * Node API for transform streams
     * @param {object} chunk The next chunk of data from read stream
     * @param {*} encoding The encoding of the chunk (e.g. UTF-8)
     * @param {*} cb Callback indicating chunk was processed and ready for next chunk
     */
    _transform(chunk, encoding, cb) {
        this.validateSegment(chunk);
        cb();
    }

    /**
     * Validate a segment
     * @param {string} segment The segment from X12parser stream
     */
    validateSegment(segment) {
    }
}

module.exports = X12parser;