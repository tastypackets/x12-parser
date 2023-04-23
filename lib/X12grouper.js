const { Transform } = require('stream');
const Schema = require('./Schema');
const Group = require('./Group');

class X12grouper extends Transform {
  /**
   * Creates a new Validator stream
   * @param {Schema[] | Schema} schemas An array of Schemas the grouper can use to dynamically adjust
   */
  constructor(schemas = null) {
    super({ objectMode: true });

    this._schemas = Array.isArray(schemas) ? schemas : [schemas]; //TODO: Validate schema
    this._version = '';
    this._activeGroup = null;
    this._defaultSchema =
      this._schemas.find((schema) => schema.default) || this._schemas[0];
    this._initialHold = [];

    this._schemas.forEach((schema) => {
      if (!(schema instanceof Schema)) {
        throw new TypeError('Every schema must be a Schema object');
      }
    });
  }

  /**
   * Do not directly use, this is called by readable stream methods when stream has finished
   * @param {function} cb Execute cb when done flushing
   */
  _flush(cb) {
    if (this._activeGroup) {
      this.groupDone(this._activeGroup);
    }
    cb();
  }

  /**
   * Node API for transform streams
   * @param {object} chunk The next chunk of data from read stream
   * @param {string} encoding The encoding of the chunk (e.g. UTF-8)
   * @param {function} cb Callback indicating chunk was processed and ready for next chunk
   */
  _transform(chunk, encoding, cb) {
    this.processSegment(chunk);
    cb();
  }

  //TODO: Add validation to GS
  set version(GS) {
    this._version = GS['8'];
    this._initialHold.forEach((segment) => this.appendToGroup(segment));
    this._initialHold = [];
  }

  /**
   * Creates a new group
   * @param {object} segment Segment from X12parser
   */
  newGroup(segment) {
    const match =
      this._schemas.find((item) => item.version === this._version) ||
      this._defaultSchema;

    // If there is no active groups and schema start doesn't match send this along as-is wo/ grouping
    if (segment.name !== match.schema.start && !this._activeGroup) {
      this.push(segment);
    } else {
      this._activeGroup = new Group(
        match.schema,
        segment,
        this.groupDone.bind(this)
      );
    }
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
   * Adds data to the active group
   * @param {object} segment Segment from the X12parser
   */
  appendToGroup(segment) {
    if (!this._activeGroup) {
      this.newGroup(segment);
    } else if (!this._activeGroup.add(segment)) {
      this.newGroup(segment);
    }
  }

  /**
   * Process a segment
   * @param {string} segment The segment from X12parser stream
   */
  processSegment(segment) {
    // Since we select version from GS we need to hold ISA in case it's part of schema
    if (segment.name === 'ISA') {
      this._initialHold.push(segment);
      return;
    } else if (segment.name === 'GS') {
      this.version = segment;
    }

    this.appendToGroup(segment);
  }
}

module.exports = X12grouper;
