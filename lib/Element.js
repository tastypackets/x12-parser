import { delimiter } from "path";

class Element {
    constructor(data, delimiters) {
        this._delmiters = delmiters;
        this._parsed = Element.parseElement(data, delimiters);
    }

    static parseElement(data, delimiters) {
        
    }
}