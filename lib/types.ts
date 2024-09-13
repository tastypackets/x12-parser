export interface Delimiters {
  segment: string;
  component: string;
  element: string;
  repetition: string;
}

/** Segment from X12Parser */
export interface FormattedSegment {
  /** Name of the segment, e.g. 'ISA' */
  name: string;
  [key: string]: string;
}

export interface GroupShape {
  /**
   * What segment indicates the start of this group
   * @example 'ST'
   */
  start: string;
  /**
   * What segment indicates the end of this group
   * If this is unbounded group do not pass this and it'll be terminated by a new group start
   * @example 'SE'
   */
  end?: string;
  /**
   * An array of segment names that indicate the end of a group
   * @example ['N1', 'LX']
   */
  terminators?: string[];
  /**
   * Descriptive name to return for a segment, useful for naming loops in X12 specs
   * @example 'Transaction'
   */
  name: string;
  /**
   * Nested groups, these are groups that belong to this parent group
   * @warning Large parent groups will increase memory usage
   */
  groups?: GroupShape[];
}

export interface GroupData {
  name: string;
  data: GroupOrSegment[];
  // Make it easy to type guard if it is a Group or Segment
  isGroup: true;
}

export type GroupOrSegment = GroupData | FormattedSegment;
