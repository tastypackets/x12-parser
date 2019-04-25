const { X12grouper, Schema } = require('../index');
const assert = require('assert');
const { finished } = require('./testFiles/835/profee-done');

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

const testSchema = new Schema('005010X221A1',schema, true)
const testSchema2 = new Schema('005010X221',schema, false)

//TODO: Still need to add unit tests for some specific methods
describe('X12grouper', function () {
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
        it('Should accept a single schema object', function () {
            const tmpGrouper = new X12grouper(testSchema);
            assert.deepStrictEqual(tmpGrouper._schemas, [testSchema]);
        });
        it('Should accept an array of schemas', function () {
            const tmpGrouper = new X12grouper([testSchema, testSchema2]);
            assert.deepStrictEqual(tmpGrouper._schemas, [testSchema, testSchema2]);
        });
    });
    describe('#processSegment()', function () {
        it('ISA should go into an intial hold', function () {
            const tmpGrouper = new X12grouper(testSchema);
            tmpGrouper.write(finished[0]); // ISA
            assert.deepStrictEqual(tmpGrouper._initialHold[0], finished[0]);
        });
        it('Items in initial hold should come down pipe before new segment', function () {
            // ISA -> Hold
            // GS -> Process Hold (ISA) -> Process GS
            const tmpGrouper = new X12grouper(testSchema);
            let counter = 0;
            tmpGrouper.on('data', data => {
                assert.deepStrictEqual(finished[counter], data);
                counter++;
            })
            tmpGrouper.write(finished[0]); // ISA
            tmpGrouper.write(finished[1]); // GS
        });
    });
    describe('Schema detection', function () {
        it('Should set the version to GS08', function () {
            const tmpGrouper = new X12grouper([testSchema, testSchema2]);
            tmpGrouper.write(finished[1]);
            assert.strictEqual(tmpGrouper._version, '005010X221A1');
            tmpGrouper.write({...finished[1], "8": '005010X221'});
            assert.strictEqual(tmpGrouper._version, '005010X221');
        });
        it('The first schema marked as default will be the default schema', function () {
            const tmpGrouper = new X12grouper([testSchema2, testSchema]);
            assert.deepStrictEqual(tmpGrouper._defaultSchema, testSchema);
        });
        it('If no schemas are marked as the default the first schema will be used as default', function () {
            const tmpGrouper = new X12grouper([testSchema2, new Schema('005010X221A1', schema)]);
            assert.deepStrictEqual(tmpGrouper._defaultSchema, testSchema2);
        });
        it('If there is a schema version that matches GS08 it will be used', function () {
            const tmpSchema = new Schema('005010X221A1', {...schema, name: 'test'});
            const tmpGrouper = new X12grouper([testSchema2, tmpSchema]);
            tmpGrouper.write(finished[1]); // GS
            tmpGrouper.write(finished[14]); // CLP
            assert.strictEqual(tmpGrouper._activeGroup._schema.name, 'test');
        });
        it('If there is no schema version that matches GS08 the default will be used', function () {
            const tmpSchema = new Schema('random', {...schema, name: 'test'});
            const tmpGrouper = new X12grouper([testSchema2, tmpSchema]);
            tmpGrouper.write(finished[1]); // GS
            tmpGrouper.write(finished[14]); // CLP
            assert.strictEqual(tmpGrouper._activeGroup._schema.name, '2100');
        });
        it('If segment is GS it will update the version and use new schema', function () {
            const tmpSchema = new Schema('005010X221A1', {...schema, name: 'test'});
            const tmpGrouper = new X12grouper([testSchema2, tmpSchema]);
            tmpGrouper.write(finished[1]); // GS - 005010X221A1
            tmpGrouper.write(finished[14]); // CLP
            assert.strictEqual(tmpGrouper._version, '005010X221A1');
            assert.strictEqual(tmpGrouper._activeGroup._schema.name, 'test');
            tmpGrouper.write({...finished[1], "8": '005010X221'}); // GS
            tmpGrouper.write(finished[14]); // CLP
            assert.strictEqual(tmpGrouper._version, '005010X221');
            assert.strictEqual(tmpGrouper._activeGroup._schema.name, '2100');
        });
    });
});