const { Transform } = require('stream');
const Schema = require('./Schema');
const Group = require('./Group');

class X12grouper extends Transform {
    /**
     * Creates a new Validator stream
     * @param {Schema[]} schemas A custom schema to use instead of attempting to auto use ST indication
     */
    constructor(schemas = null) {
        super({objectMode: true})

        this._schema = Array.isArray(schemas) ? schemas : [schemas]; //TODO: Validate schema
        this._transactionSet = '';
        this._version = '';
        this._activeGroup = null;

        this._schema.forEach(schema => {
            if(!(schema instanceof Schema)) {
                throw new TypeError('Every schema must be a Schema object')
            }
        })
    }

    /**
     * Do not directly use, this is called by readable stream methods when stream has finished
     * @param {function} cb Execute cb when done flushing
     */
    _flush(cb) {
        if(this._activeGroup) {
            this.groupDone(this._activeGroup)
        }
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
     * Sends the grouped data down the stream
     * @param {Group} group Group to send
     */
    groupDone(group) {
        this.push(group.data);
        this._activeGroup = null;
    }

    /**
     * Process a segment
     * @param {string} segment The segment from X12parser stream
     */
    processSegment(segment) {
        // Set / update transaction & version
        if(segment.name === 'GS') {
            this.version = segment;
        } else if(segment.name === 'ST') {
            this.transactionSet = segment;
        } else if(!this._activeGroup) {
            this._activeGroup = new Group(this._schema[0].schema, segment, this.groupDone);
        } else if(!this._activeGroup.add(segment)) {
            this._activeGroup = new Group(this._schema[0].schema, segment, this.groupDone);
        }
    }
}

module.exports = X12grouper;