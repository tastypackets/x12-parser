export = Segment;
declare class Segment {
  /**
   * Removes uneeded chars from a string
   * @param {string} string The string to be cleaned
   * @returns {string} Cleaned version of string
   */
  static cleanString(string: string): string;
  /**
   * Creates a new segment object
   * @param {string} raw The raw string of a segment in X12 format
   * @param {object} delimiters An object of delimiters to be used to parse segment
   */
  constructor(raw: string, delimiters: object);
  _delimiters: object;
  _parsed: any[];
  _name: string;
  /** @type {string[]} */
  get parsed(): string[][];
  /** @type {string} */
  get name(): string;
  get formatted(): {
    name: string;
    [key: string]: string;
  };
  /**
   * Processes an element and formats it
   * @param {string} element The string inside the element
   * @returns {string[]} A nested array of segments & componenets
   */
  processElement(element: string): string[];
  /**
   * Parses the segments and components into an array
   * @param {string} rawData The segment string
   * @param {object} delmiters An object with delimiters for this file
   */
  parseSegment(rawData: string): void;
}
