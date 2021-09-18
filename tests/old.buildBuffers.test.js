const parseConfigure = require('../src/lowlevel/protobuf/parse_protocol').parseConfigure;
const buildBuffers = require('../src/lowlevel/send').buildBuffers;
const buildAndSend = require('../src/lowlevel/send').buildAndSend;

const receiveAndParse = require('../src/lowlevel/receive').receiveAndParse;
const patch = require('../src/lowlevel/protobuf/monkey_patch').patch;

patch();
const { ByteBuffer } = require("protobufjs-old-fixed-webpack");


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
    'GetOwnershipProof',
    'GetOwnershipId',
];

describe('buildBuffers', () => {
    fixtures
        // .filter(f => f.name === 'Features')
        .forEach(f => {

            test(`message ${f.name}`, async () => {
                expect(() => {
                    buildBuffers(parsedMessages, f.name, f.params)
                }).not.toThrow();
                const result = buildBuffers(parsedMessages, f.name, f.params)
                result.forEach(r => {
                    expect(r.byteLength).toEqual(63);
                    expect(Array.from(new Uint8Array(r))).toMatchSnapshot();
                })
                if (!failingOnDecode.includes(f.name)) {
                    const decoded = await receiveAndParse(parsedMessages, () => {
                        return Promise.resolve(ByteBuffer.concat(result));
                    })
                    // then decode message and check, whether decoded message matches original json
                    expect(decoded.type).toEqual(f.name);
                    expect(decoded.message).toEqual(f.params);
                }
            })
        })
})

