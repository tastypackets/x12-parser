const { Transform } = require('stream');
const validators = require('./X221');

class Formatter extends Transform {
    constructor() {
        super({objectMode: true})
        this.payerId = [] // Loop 1000A
        this.payeeId = [] // Loop 1000B
        this.header = [] // Loop 2000
        this.claimPayment = [] // Loop 2100
        this.servicePayment = [] // Loop 2110
        this.UID = ''; // Unquie ID to identify all data for a transaction / envelope
    }

    /**
     * Do not directly use, this is called by readable stream methods when stream has finished
     * @param {function} cb Execute cb when done flushing
     */
    _flush(cb) {
        //TODO
        cb();
    }

    /**
     * Node API for transform streams
     * @param {object} chunk The next chunk of data from read stream
     * @param {*} encoding The encoding of the chunk (e.g. UTF-8)
     * @param {*} cb Callback indicating chunk was processed and ready for next chunk
     */
    _transform(chunk, encoding, cb) {
        // We know every chunk is a segment - No validation at this time,
        //  so if user screws up it will cause an error.

        const validated = this.validateSegment(chunk.name, chunk);
        this.push(validated);
        cb();
    }

    validateSegment(name, elements) {
        const data = {...elements, validated: false};

        if(validators[name]) {
            // Object.keys(elements).forEach(key => {
            //     validators[name][key]
            // })
            data.validated = true
        }

        return data;
    }
}

exports.Formatter = Formatter;