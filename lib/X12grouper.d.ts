import type { Transform } from 'stream';
export = X12grouper;
declare class X12grouper extends Transform {
  /**
   * Creates a new Validator stream
   * @param {Schema[] | Schema} schemas An array of Schemas the grouper can use to dynamically adjust
   */
  constructor(schemas?: Schema[] | Schema);
  _schemas: Schema[];
  _version: string;
  _activeGroup: Group | null;
  _defaultSchema: Schema;
  _initialHold: any[];
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
  set version(arg: any);
  /**
   * Creates a new group
   * @param {object} segment Segment from X12parser
   */
  newGroup(segment: object): void;
  /**
   * Sends the grouped data down the stream
   * @param {Group} group Group to send
   */
  groupDone(group: Group): void;
  /**
   * Adds data to the active group
   * @param {object} segment Segment from the X12parser
   */
  appendToGroup(segment: object): void;
  /**
   * Process a segment
   * @param {string} segment The segment from X12parser stream
   */
  processSegment(segment: string): void;
}
import Schema = require('./Schema');
import Group = require('./Group');
