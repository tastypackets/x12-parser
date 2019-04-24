const { X12grouper, Schema } = require('../index');
const assert = require('assert');
// const { groupedByISASchema } = require('./testFiles/835/profee-done');
// const { createReadStream } = require('fs');

const schema = {
    "start": "CLP", // What segment starts the group
    "terminators": ["SE"], // What segment ends the group
    "name": "2100", // What is the name of the group
    "groups": [ // Nested groups
        {
            "start": "SVC",
            "name": "2110",
        }
    ]
}
// TODO: Add more tests
describe('X12grouper', function () {
    const testSchema = new Schema('005010X221A1',schema, true)
    describe('#constructor()', function () {
        const myGrouper = new X12grouper(testSchema);
        it('Should return an X12grouper', function () {
            assert(myGrouper instanceof X12grouper);
        });
        it('Should have a pipe function', function () {
            assert.strictEqual(typeof myGrouper.pipe, 'function');
        });
        it('Should return an event emitter', function () {
            assert(myGrouper instanceof require("events").EventEmitter);
        });
    });
});