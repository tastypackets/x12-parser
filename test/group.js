const Group = require('../lib/Group');
const assert = require('assert');
const { groupedByISAschema, finished, groupedByISA } = require('./testFiles/835/profee-done');

describe('Group', function () {
    const clp = { '1': 'PATIENT ACCOUNT NUMBER', '2': '1', '3': '34.25', '4': '34.25', '5': '', '6': 'MC', '7': '1000210000000030', '8': '11', name: 'CLP'}
    const svcArray = [
        {'1': 'HC', '2': '6', '3': '6', '4': '', '5': '1', name: 'SVC', '1-1': 'V2020', '1-2': 'RB'},
        {'1': '472', '2': '20100101', name: 'DTM'},
        {'1': 'B6', '2': '6', name: 'AMT'},
        {'1': 'HC', '2': '2.75', '3': '2.75', '4': '', '5': '1', name: 'SVC', '1-1': 'V2700', '1-2': 'RB'},
        {'1': '472', '2': '20100101', name: 'DTM'},
        {'1': 'B6', '2': '2.75', name: 'AMT'}
    ]
    const grouped = {
        name: '2100',
        data: [
            { '1': 'PATIENT ACCOUNT NUMBER', '2': '1', '3': '34.25', '4': '34.25', '5': '', '6': 'MC', '7': '1000210000000030', '8': '11', name: 'CLP'},
            { 
                name: '2110', 
                data: [
                    {'1': 'HC', '2': '6', '3': '6', '4': '', '5': '1', name: 'SVC', '1-1': 'V2020', '1-2': 'RB'},
                    {'1': '472', '2': '20100101', name: 'DTM'},
                    {'1': 'B6', '2': '6', name: 'AMT'}
                ]
            },
            { 
                name: '2110', 
                data: [
                    {'1': 'HC', '2': '2.75', '3': '2.75', '4': '', '5': '1', name: 'SVC', '1-1': 'V2700', '1-2': 'RB'},
                    {'1': '472', '2': '20100101', name: 'DTM'},
                    {'1': 'B6', '2': '2.75', name: 'AMT'}
                ]
            },
        ]
    }

    // ! This was written assuming multi-root groups, which is not yet supported.
    const schema = {
        "version": "005010X221A1", // What version of the transaction set this applies to
        "start": 'ST', // What segment starts the group
        "name": "Transaction", // What is the name of the group
        "end": "SE", // Closes all nested groups when this is detected
        "groups" : [ // An array of groups to create
            {
                "start": 'N1', // What segment starts the group
                "end": null, // What segment ends the group
                "name": "1000", // What is the name of the group
                "terminators": ['N1', 'LX'],
                "groups": [ // Nested groups
                    {
                        "start": 'N1',
                        "end": null,
                        "name": "1000B"
                    }
                ]
            }, // -- At this point group 1000A would be pushed down the data stream before starting loop 2000
            {
                "start": 'CLP',
                "end": null,
                "name": "2100",
                "terminators": ['CLP'],
                "groups": [
                    {
                        "start": 'SVC',
                        "end": null,
                        "name": "2110"
                    }
                ]
            }
        ]
    }

    describe('#constructor()', function () {
        it('Should return an instance of group', function () {
            const myGroup = new Group(schema.groups[1], clp, () => {});
            assert(myGroup instanceof Group);
        });
    });
    describe('#terminate()', function () {
        it('Should execute cb with grouped data', function () {
            const callDone = group => {
                assert(group instanceof Group);
                assert.deepStrictEqual(group.data, {name: '2100', data: [{...clp}]});
            }
            const myGroup = new Group(schema.groups[1], clp, callDone);
            myGroup.terminate();
        });
    });
    describe('#add()', function () {
        it('Should group nested data', function () {
            const callDone = group => {
                assert.deepStrictEqual(group.data, grouped);
            }
            const myGroup = new Group(schema.groups[1], clp, callDone);
            svcArray.forEach(svc => { 
                assert.strictEqual(myGroup.add(svc), true);
            });
            myGroup.terminate();
        });
        it('Should be able to group multiple nested groups', function () {
            const callDone = group => {
                assert.deepStrictEqual(group.data, groupedByISA);
            }
            const myGroup = new Group(groupedByISAschema, finished[0], callDone);
            finished.forEach((item, index) => {
                //Skip first index / ISA
                if(index === 0)
                    return;

                myGroup.add(item)
            })
            myGroup.terminate();
        });
    });
});