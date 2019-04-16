const { X12parser } = require('../index');
const assert = require('assert');
const { createReadStream } = require('fs');

describe('X12parser', function () {
    describe('#constructor()', function () {
        const myParser = new X12parser();
        it('Should return an X12parser', function () {
            assert(myParser instanceof X12parser);
        });
        it('Should have a pipe function', function () {
            assert.strictEqual(typeof myParser.pipe, 'function');
        });
        it('Should return an event emitter', function () {
            assert(myParser instanceof require("events").EventEmitter);
        });
    });
    describe('835 File Tests', function () {
        it('Should parse files with CRLF', function () {
            const myParser = new X12parser();
            const testFile = createReadStream('./test/testFiles/835/profee.edi')
            let counter = 0; // So ugly... This should be done nicer
            const { finished } = require('./testFiles/835/profee-done');
            testFile.pipe(myParser).on('data', data => {
                assert.deepStrictEqual(data, finished[counter])
                counter++
            });
        });
        it('Should parse single line files', function() {
            const myParser = new X12parser();
            const testFile = createReadStream('./test/testFiles/835/profeeOneLine.edi');
            let counter = 0; // So ugly... This should be done nicer
            const { finished } = require('./testFiles/835/profee-done');
            testFile.pipe(myParser).on('data', data => {
                assert.deepStrictEqual(data, finished[counter])
                counter++
            });
        });
        it('Should parse multiple transactions (ISA) in a single file', function() {
            const myParser = new X12parser();
            const testFile = createReadStream('./test/testFiles/835/profeeMultiple.edi');
            let counter = 0; // So ugly... This should be done nicer
            const { finished } = require('./testFiles/835/profee-done');
            testFile.pipe(myParser).on('data', data => {
                if(!finished[counter]) // Super ugly, but resets counter if undefined since it's same ISA just duplicated in file
                    counter = 0;

                assert.deepStrictEqual(data, finished[counter])
                counter++
            });
        });
        it('Should parse multiline files without delimiter (LF/CRLF is delimiter)', function() {
            const myParser = new X12parser();
            const testFile = createReadStream('./test/testFiles/835/multiLineNotDelimited.edi');
            let counter = 0; // So ugly... This should be done nicer
            const { finished } = require('./testFiles/835/profee-done');
            testFile.pipe(myParser).on('data', data => {
                assert.deepStrictEqual(data, finished[counter])
                counter++
            });
        });
    });
});