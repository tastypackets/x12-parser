import type { Delimiters, FormattedSegment } from '@/types';

export class Segment {
  #delimiters: Delimiters;
  #parsed: string[][];
  #name: string;

  /**
   * Creates a new segment object
   * @constructor
   * @param raw The raw string of a segment in X12 format
   * @param delimiters An object of delimiters to be used to parse segment
   */
  constructor(raw: string, delimiters: Delimiters) {
    this.#delimiters = delimiters;
    this.#parsed = [];
    this.#name = '';

    this.parseSegment(raw);
  }

  get parsed() {
    return this.#parsed;
  }

  get name() {
    return this.#name;
  }

  get formatted(): FormattedSegment {
    const formatted: FormattedSegment = { name: this.#name };

    this.#parsed.forEach((element, elementIndex) => {
      // First item in parsed string is the segment value, everything else is components
      formatted[`${elementIndex + 1}`] = element.shift() ?? '';

      // Add components
      element.forEach((component, componentIndex) => {
        formatted[`${elementIndex + 1}-${componentIndex + 1}`] = component;
      });
    });

    return formatted;
  }

  /**
   * Removes unneeded chars from a string
   */
  static cleanString(string: string): string {
    return string
      .replace(/\n/g, '') // Remove new lines
      .trim(); // Remove white space
  }

  /**
   * Processes an element and formats it
   * @param element The string inside the element
   * @returns A nested array of segments & components
   */
  processElement(element: string): string[] {
    // If this is ISA we don't want to split on component
    if (this.#name === 'ISA') {
      return [Segment.cleanString(element)];
    } else {
      return element
        .split(this.#delimiters.component)
        .map((string) => Segment.cleanString(string));
    }
  }

  /**
   * Parses the segments and components into an array
   * @param rawData The segment string
   */
  parseSegment(rawData: string) {
    const elements = rawData.split(this.#delimiters.element);

    const rawName = elements.shift();
    if (!rawName) {
      throw new Error(
        `No strings found in element using deliminator ${
          this.#delimiters.element
        }, is the correct deliminator passed? Element data: ${rawData}`
      );
    }

    // Extract name
    this.#name = Segment.cleanString(rawName);

    // Get formatted element w/ components
    this.#parsed = elements.map((element) => this.processElement(element));
  }
}
