const { X12parser } = require('../lib/X12parser');
const assert = require('assert');
const { createReadStream } = require('fs');

describe('X12parser', function () {
    describe('#constructor()', function () {
        const myParser = new X12parser();
        it('Shuld return a X12parser', function () {
            assert(myParser instanceof X12parser);
        });
        it('Shuld have a pipe function', function () {
            assert.strictEqual(typeof myParser.pipe, 'function');
        });
        it('Shuld return an event emitter', function () {
            assert(myParser instanceof require("events").EventEmitter);
        });
    });
    describe('835 File w/ CRLF', function () {
        const myParser = new X12parser();
        it('Should parse files with CRLF', function () {
            const testFile = createReadStream('./test/testFiles/835/profee.edi')
            let counter = 0; // So ugly... This should be done nicer
            const { finished } = require('./testFiles/835/profee-done');
            testFile.pipe(myParser).on('data', data => {
                assert.deepStrictEqual(data, finished[counter])
                counter++
            });
        });
    });
});