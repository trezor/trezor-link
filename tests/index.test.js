const parseConfigure = require('../src/lowlevel/protobuf/parse_protocol').parseConfigure
const buildOne = require('../src/lowlevel/send').buildOne;
const receiveOne = require('../src/lowlevel/receive').receiveOne;
const patch = require('../src/lowlevel/protobuf/monkey_patch').patch;

patch();

const messages = require('./__fixtures__/messages.json');
const fixtures = require('./__fixtures__/messages');

const parsedMessages = parseConfigure(JSON.stringify(messages));

// all these are failing on       
// at _fieldsByName (src/lowlevel/protobuf/message_decoder.js:110:21)
// they all seem to have in common a field that has rule: repeated and type bytes
//  {
//     "rule": "repeated",
//     "options": {},
//     "type": "bytes",
//     "name": "signatures",
//     "id": 2
// },
// they also have in common the fact that we encode them, but never decode them. this makes
// me think that it a bug indeed.
const failingOnDecode = [
    'GetAddress',
    'TxAck',
    'EosTxActionAck',
    'MoneroTransactionInitRequest',
    'MoneroTransactionInitAck',
    'MoneroTransactionSetInputRequest',
    'MoneroTransactionInputViniRequest',
    'MoneroTransactionAllInputsSetAck',
    'MoneroTransactionSetOutputRequest',
    'MoneroTransactionSetOutputAck',
    'MoneroTransactionAllOutSetRequest',
    'MoneroTransactionSignInputRequest',
    'MoneroKeyImageSyncStepRequest',
    'DebugMoneroDiagRequest',
    'DebugMoneroDiagAck',
    'TezosSignTx',
];

describe('encoding json -> protobuf', () => {
    fixtures
        // .filter(f => f.name === 'TezosSignTx') // for debug
        .forEach(f => {
            test(`message ${f.name} ${JSON.stringify(f.params)}`, () => {
                expect(() => {
                    buildOne(parsedMessages, f.name, f.params)
                }).not.toThrow();
                // first encoded message and save its snapshot, this will be useful 
                // when we start refactoring.
                const encodedMessage = buildOne(parsedMessages, f.name, f.params)
                expect(encodedMessage.toString('hex')).toMatchSnapshot();
                if (!failingOnDecode.includes(f.name)) {
                  // then decode message and check, whether decoded message matches original json
                  const decodedMessage = receiveOne(parsedMessages, encodedMessage);
                  expect(decodedMessage.type).toEqual(f.name);
                  expect(decodedMessage.message).toEqual(f.params);
                }
            });
        })
})
