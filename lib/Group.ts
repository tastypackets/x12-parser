import type {
  FormattedSegment,
  GroupShape,
  GroupOrSegment,
  GroupData,
} from '@/types.js';

export class Group {
  #schema: GroupShape;
  #name: string;
  #end: string | null;
  #groups: GroupShape[];
  #terminators: string[];
  #groupHolds: Group[];
  // TODO: Possibly rename, this holds groups and segments and name is confusing
  #segmentsHolds: GroupOrSegment[];
  #terminateCB: (group: Group) => void;

  /**
   * Creates a new segment object
   * @param schema Schema to use for this grouping
   * @param segment Segment from X12parser to start group
   * @param terminateCB Function to execute when group is closed
   */
  constructor(
    schema: GroupShape,
    segment: FormattedSegment,
    terminateCB: (group: Group) => void
  ) {
    this.#schema = schema;
    this.#name = schema.name || 'No Name';
    this.#end = schema.end || null;
    this.#groups = schema.groups || [];
    this.#terminators = schema.terminators || [];
    this.#groupHolds = [];
    this.#segmentsHolds = [];
    this.#terminateCB = terminateCB;

    // If unbounded add own start to terminators
    if (!this.#end && !this.#terminators.includes(schema.start)) {
      this.#terminators.push(this.#schema.start);
    } else if (this.#end) {
      this.#terminators.push(this.#end);
    }

    this.#appendData(segment);
  }

  get schema(): GroupShape {
    return this.#schema;
  }

  get hasGroups(): boolean {
    return this.#groupHolds.length !== 0;
  }

  get data(): GroupData {
    return {
      name: this.#name,
      data: this.#segmentsHolds,
      isGroup: true,
    };
  }

  /**
   * Looks to see if a segment name is in the list of group terminators
   * @param name Name of the segment
   */
  #isTerminator(name: string): boolean {
    return this.#terminators.includes(name);
  }

  /**
   * Checks with all subgroups in order if this belongs to them
   * @param segment Segment from X12parser stream
   */
  #checkSubGroups(segment: FormattedSegment): boolean {
    if (!this.hasGroups) {
      return false;
    }

    const groupSize = this.#groupHolds.length;
    for (let i = 0; i < groupSize; i++) {
      // If handled do not check with any more groups
      if (this.#groupHolds[i].add(segment)) {
        return true;
      }
    }

    return false;
  }

  /**
   * Looks for a subgroup schema for this segment name
   * @param name Name of the segment
   */
  #subGroupSchema(name: string): GroupShape | undefined {
    return this.#groups.find((group) => group.start === name);
  }

  /**
   * Adds data to the held segments group
   * @param data Segment data to be held in this group
   */
  #appendData(segment: GroupOrSegment) {
    if (typeof segment !== 'object')
      throw new TypeError('Append data must be an object');

    if (!segment.name)
      throw new Error('Append data must have a valid segment name');

    this.#segmentsHolds.push(segment);
  }

  /**
   * Adds a new group to the groups array
   * @param schema Schema for this group
   */
  #addGroup(schema: GroupShape, segment: FormattedSegment): void {
    this.#groupHolds.push(
      new Group(schema, segment, this.#removeGroup.bind(this))
    );
  }

  /**
   * Removes one group from the list of held groups
   * @param group Group to be removed
   */
  #removeGroup(group: Group): void {
    // Add group segments to held segments before deleting group
    this.#appendData(group.data);
    const index = this.#groupHolds.indexOf(group);
    this.#groupHolds.splice(index, 1);
  }

  /**
   * Tells the group and all subgroups to immediately terminate
   */
  terminate(): void {
    // Terminate any nested groups
    this.#groupHolds.forEach((group) => {
      //console.log(group)
      group.terminate();
    });

    this.#terminateCB(this);
  }

  /**
   * Takes a segment and adds it to the proper part of a group if it belongs
   * @param segment Segment from X12parser stream
   * @return Indicates if group accepted the segment or not
   */
  add(segment: FormattedSegment): boolean {
    // If this terminates the group exit
    if (this.#isTerminator(segment.name)) {
      // If this was end we want to append data first (bounded loops)
      if (segment.name === this.#end) {
        this.#appendData(segment);
        this.terminate();
        return true;
      }

      // Clean-up group
      this.terminate();
      return false;
    }

    // If a subgroup can handle this let it collect the data
    if (this.#checkSubGroups(segment)) {
      return true;
    }

    // If this can create a subgroup create it
    const subGroupSchema = this.#subGroupSchema(segment.name);
    if (subGroupSchema) {
      this.#addGroup(subGroupSchema, segment);
      return true;
    }

    // No termination or subgroup, so save it as root prop
    this.#appendData(segment);
    return true;
  }
}
