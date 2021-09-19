const parseConfigure = require('../src/lowlevel/protobuf/parse_protocol-new').parseConfigure
const buildBuffers = require('../src/lowlevel/send-new').buildBuffers;
const receiveAndParse = require('../src/lowlevel/receive-new').receiveAndParse;

const messages = require('../messages.json');
const fixtures = require('./__fixtures__/messages');

const { ByteBuffer } = require("protobufjs-old-fixed-webpack");

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

let parsedMessages = null
const getParsedMessages = async () => {
    if (parsedMessages) return parsedMessages;
    parsedMessages = await parseConfigure(messages);
    return parsedMessages;
}


describe('buildBuffers', () => {
    fixtures
        .filter(f => f.name === 'Features')
        .forEach(f => {

            test(`message ${f.name}`, async () => {
                const parsedMessages = await getParsedMessages();

                expect(() => {
                    buildBuffers(parsedMessages, f.name, f.params)
                }).not.toThrow();
                const result = buildBuffers(parsedMessages, f.name, f.params)
                result.forEach(r => {
                    expect(r.byteLength).toEqual(63);
                    expect(Array.from(new Uint8Array(r))).toMatchSnapshot();
                })
                console.log('result', result);
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

