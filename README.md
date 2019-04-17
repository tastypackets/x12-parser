[![Build Status](https://travis-ci.org/tastypackets/x12-parser.svg?branch=master)](https://travis-ci.org/tastypackets/x12-parser)

# Initial release to-do list
- [x] Create parser
- - [x] Create initial unit tests for 835s
- [] Create docs
- [] Create validator stream
- - [] Unit tests
- [] Create grouping stream
- - [] Unit tests
- [] Create example end to end usage
- [] Publish to NPM

## Beta
This lib is currently only being used in beta testing and is not yet released on NPM.

https://tastypackets.github.io/x12-parser/

## x12
JavaScript EDI Parser that uses datastreams

## Notes
This lib does not enforce 2 charector segment & componenet names, it simply increments the number. For example `ISA01` would be `ISA1` in the output object and `ISA10` would still be `ISA10`. Similarly components such as `SVC01-01` would be `SVC1-1`.

If this becomes an issue for processing the 2 charector enforcement can be added, however it was dropped to reduce processing of each segment name.

## Validation
The validation process is another Transform stream, with the goal of validating segments and elements. It should also contain any envelope / header related validation needed.

## Grouping
The grouping stage is another transform stream, it is designed to help grouop data in the X12 files.

### Overview
X12 file (ISA********~) -> Parser -> segments {name: 'ISA', 01: '12'} -> Validation -> {name: 'ISA', 01: 12, valid: true} -> Formatter -> grouped by CLP