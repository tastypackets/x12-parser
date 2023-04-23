export = Group;
import Schema from './Schema';
declare class Group {
  /**
   * Creates a new segment object
   * @param {Schema} schema Schema to use for this grouping
   * @param {Segment} segment Segment from X12parser to start group
   * @param {function} terminateCB Function to execute when group is closed
   */
  constructor(schema: any, segment: any, terminateCB: Function);
  _schema: Schema;
  _name: string;
  _end: string | null;
  _groups: any;
  _terminators: string[];
  _groupHolds: any[];
  _segmentsHolds: any[];
  _terminatedGroups: any[];
  _terminateCB: Function;
  /** @type {boolean} */
  get hasGroups(): boolean;
  /** @type {object} */
  get data(): object;
  /**
   * Looks to see if a segment name is in the list of group terminators
   * @param {string} name Name of the segment
   */
  _isTerminator(name: string): boolean;
  /**
   * Checks with all subgroups in order if this belong to them
   * @param {object} segment Segment from X12parser stream
   * @returns {boolean} Indicates if any subgroups handled this
   */
  _checkSubGroups(segment: object): boolean;
  /**
   * Looks for a subgroup schema for this segment name
   * @param {string} name Name of the segment
   */
  _subGroupSchema(name: string): any;
  /**
   * Adds data to the held segments group
   * @param {object} data Segment data to be held in this group
   */
  _appendData(data: object): void;
  /**
   * Adds a new group to the groups array
   * @param {object} schema Schema for this group
   */
  _addGroup(schema: object, segment: any): void;
  /**
   * Removes one group from the list of held groups
   * @param {Group} group Group to be removed
   */
  _removeGroup(group: Group): void;
  /**
   * Tells the group and all subgroups to immediatly terminate
   */
  terminate(): void;
  /**
   * Takes a segment and adds it to the proper part of a group if it belongs
   * @param {object} segment Segment from X12parser stream
   * @returns {boolean} Indicates if group accepted the segment or not
   */
  add(segment: object): boolean;
}
