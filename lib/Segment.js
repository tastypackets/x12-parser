class Segment {
    /**
     * Creates a new segment object
     * @param {string} name The name of the segment, first 3 chars (like BPR)
     * @param {array} parsed The array of elements
     */
    constructor(raw, delmiters) {
        this._delmiters = delmiters;
        this._parsed = '';
        this._name = '';

        this.parseSegment(raw);
    }

    get parsed() {
        return this._parsed;
    }

    get formatted() {
        let formatted = {name: this._name};
        this._parsed.forEach((element, elementIndex) => {
            // First value is the initial value
            formatted[`${elementIndex + 1}`] = element.splice(0,1)[0];

            // Add componenets
            element.forEach((component, componentIndex) => {
                formatted[`${elementIndex + 1}-${componentIndex + 1}`] = component;
            });
        });

        return formatted;
    }

    /**
     * Removes uneeded chars from a string
     * @param {string} string The string to be cleaned
     * @returns {string} Cleaned version of string
     */
    static cleanString(string) {
        return string
            .replace(/\n/g, '') // Remove new lines
            .trim() // Remove white space
    }

    /**
     * Processes an element and formats it
     * @param {string} element The string inside the element
     * @returns {array[]} A nested array of segments & componenets
     */
    processElement(element) {
        // If this is ISA we don't want to split on component
        if(this._name === 'ISA') {
            return [Segment.cleanString(element)];
        } else {
            return element
                .split(this._delmiters.component)
                .map(string => Segment.cleanString(string))
        }
    }

    /**
     * Parses the segments and components into an array
     * @param {string} rawData The segment string
     * @param {object} delmiters An object with delimiters for this file
     */
    parseSegment(rawData) {
        // Separate elements
        const elements = rawData.split(this._delmiters.element);
            
        // Extract name
        this._name = Segment.cleanString(elements.splice(0, 1)[0]);

        // Get formatted element w/ componenets
        this._parsed = elements.map(element => this.processElement(element));
    }
}

exports.Segment = Segment;