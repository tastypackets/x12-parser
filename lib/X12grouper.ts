import { Transform } from 'node:stream';

import { Schema } from '@/Schema';
import { Group } from '@/Group';
import type { FormattedSegment } from '@/types';

export class X12grouper extends Transform {
  #schemas: Schema[];
  #version: string;
  #activeGroup: Group | null;
  #defaultSchema: Schema;
  #initialHold: FormattedSegment[];

  /**
   * Creates a new Validator stream
   * @param {Schema[] | Schema} schemas A Schema or array of Schemas the grouper can use to dynamically select based on X12 file version
   */
  constructor(schemas: Schema[] | Schema) {
    super({ objectMode: true });

    this.#schemas = Array.isArray(schemas) ? schemas : [schemas];
    this.#version = '';
    this.#activeGroup = null;
    this.#defaultSchema =
      this.#schemas.find((schema) => schema.default) || this.#schemas[0];
    this.#initialHold = [];

    this.#schemas.forEach((schema) => {
      if (!(schema instanceof Schema)) {
        throw new TypeError('Every schema must be a Schema object');
      }
    });
  }

  get schemas() {
    return this.#schemas;
  }
  get activeVersion() {
    return this.#version;
  }
  get activeGroup() {
    return this.#activeGroup;
  }
  get initialHold() {
    return this.#initialHold;
  }
  get defaultSchema() {
    return this.#defaultSchema;
  }

  /**
   * Do not directly use, this is called by readable stream methods when stream has finished
   * @param cb Execute cb when done flushing
   */
  _flush(cb: () => void): void {
    if (this.#activeGroup) {
      this.groupDone(this.#activeGroup);
    }
    cb();
  }

  /**
   * Node API for transform streams
   * @param chunk The next chunk of data from read stream
   * @param encoding The encoding of the chunk (e.g. UTF-8)
   * @param cb Callback indicating chunk was processed and ready for next chunk
   */
  _transform(chunk: FormattedSegment, _encoding: string, cb: () => void): void {
    this.processSegment(chunk);
    cb();
  }

  //TODO: Add validation to GS
  set version(GS: FormattedSegment) {
    this.#version = GS['8'];
    this.#initialHold.forEach((segment) => this.appendToGroup(segment));
    this.#initialHold = [];
  }

  newGroup(segment: FormattedSegment): void {
    const match =
      this.#schemas.find((item) => item.version === this.#version) ||
      this.#defaultSchema;

    // If there is no active groups and it does not match the segmane name used to start the group emit this segment without grouping
    if (segment.name !== match.schema.start && !this.#activeGroup) {
      this.push(segment);
    } else {
      this.#activeGroup = new Group(
        match.schema,
        segment,
        this.groupDone.bind(this)
      );
    }
  }

  /**
   * Sends the grouped data down the stream and resets active group
   */
  groupDone(group: Group): void {
    this.push(group.data);
    this.#activeGroup = null;
  }

  /**
   * Adds data to the active group or starts a new group
   */
  appendToGroup(segment: FormattedSegment): void {
    if (!this.#activeGroup) {
      this.newGroup(segment);
    } else if (!this.#activeGroup.add(segment)) {
      this.newGroup(segment);
    }
  }

  processSegment(segment: FormattedSegment): undefined {
    // Since we select version from GS we need to hold ISA in case it's part of schema
    if (segment.name === 'ISA') {
      this.#initialHold.push(segment);
      return;
    } else if (segment.name === 'GS') {
      this.version = segment;
    }

    this.appendToGroup(segment);
  }
}
