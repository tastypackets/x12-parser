const { Transform } = require('stream');

class X12group extends Transform {
    /**
     * Creates a new Validator stream
     * @param {object} schema A custom schema to use instead of attempting to auto use ST indication
     */
    constructor(schema = null) {
        super({objectMode: true})
        this._schema = schema; //TODO: Validate schema
        this._transactionSet = '';
        this._version = '';
    }

    /**
     * Do not directly use, this is called by readable stream methods when stream has finished
     * @param {function} cb Execute cb when done flushing
     */
    _flush(cb) {
        cb();
    }

    /**
     * Node API for transform streams
     * @param {object} chunk The next chunk of data from read stream
     * @param {*} encoding The encoding of the chunk (e.g. UTF-8)
     * @param {*} cb Callback indicating chunk was processed and ready for next chunk
     */
    _transform(chunk, encoding, cb) {
        this.processSegment(chunk);
        cb();
    }

    //TODO: Add validation to ST
    set transactionSet(ST) {
        this._transactionSet = ST['1'];
    }

    //TODO: Add validation to GS
    set version(GS) {
        this._version = GS['8'];
    }

    /**
     * Determins if this segment is a terminator in the active schema
     * @param {string} segment Segment name
     */
    isTerminator(name) {
        return this._schema.terminators.includes(name);
    } 

    /**
     * Process a segment
     * @param {string} segment The segment from X12parser stream
     */
    processSegment(segment) {
        // If this is a terminator and there is a group we know group has closed
        if(this.isTerminator(segment.name) && this._group) {
            this.push(this.group.json)
        }

        // Set / update transaction & version
        if(segment.name === 'GS') {
            this.version = segment;
        } else if(segment.name === 'ST') {
            this.transactionSet = segment;
        }

        // If there is not currently an active group see if this segment is a group stage
        if(!this._group) {
            const group = this._schema.find(group => group.start === segment.name)
            // If this is not a group stage push the data
            if(!group) {
                this.push(segment)
            } else {
                //TODO: Create new group
            }
        } else {
            // If there is currently a group process segment against it
            const result = this._group.newSegment(segment)
            if(!result) {
                const group = this._schema.find(group => group.start === segment.name) // TODO... DUPE line!!!!
            }
        }
    }
}

module.exports = X12group;