const { X12parser } = require('../lib/X12parser');
const { Formatter } = require('../formatters/835/Formatter');
const assert = require('assert');
const { createReadStream } = require('fs');

describe('Formatter', function () {
    describe('#constructor()', function () {
        const myFormatter = new Formatter();
        it('Shuld return a Formatter', function () {
            assert(myFormatter instanceof Formatter);
        });
        it('Shuld have a pipe function', function () {
            assert.strictEqual(typeof myFormatter.pipe, 'function');
        });
        it('Shuld return an event emitter', function () {
            assert(myFormatter instanceof require("events").EventEmitter);
        });
    });
    describe('Pipe parser into formatter', function () {
        const myFormatter = new Formatter();
        const myParser = new X12parser();
        it('Should format files', function () {
            const testFile = createReadStream('./test/testFiles/835/profee.edi')
            // let counter = 0; // So ugly... This should be done nicer
            const { finished } = require('./testFiles/835/profee-done');
            testFile.pipe(myParser).pipe(myFormatter).on('data', data => {
                console.log(data)
                // assert.deepStrictEqual(data, finished[counter])
                // counter++
            });
        });
    });
});