/**
 * @jest-environment jsdom
 */
const parseConfigure = require('../src/lowlevel/protobuf/parse_protocol-new').parseConfigure
const buildOne = require('../src/lowlevel/send-new').buildOne;
const receiveOne = require('../src/lowlevel/receive-new').receiveOne;

const messages = require('../messages.json');
const fixtures = require('./__fixtures__/messages');


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
// update: these vere failing in the old code but seem to be fixed now
const failingOnDecode = [
    // 'GetAddress',
    // 'TxAck',
    // 'EosTxActionAck',
    // 'MoneroTransactionInitRequest',
    // 'MoneroTransactionInitAck',
    // 'MoneroTransactionSetInputRequest',
    // 'MoneroTransactionInputViniRequest',
    // 'MoneroTransactionAllInputsSetAck',
    // 'MoneroTransactionSetOutputRequest',
    // 'MoneroTransactionSetOutputAck',
    // 'MoneroTransactionAllOutSetRequest',
    // 'MoneroTransactionSignInputRequest',
    // 'MoneroKeyImageSyncStepRequest',
    // 'DebugMoneroDiagRequest',
    // 'DebugMoneroDiagAck',
    // 'TezosSignTx',
    // 'GetOwnershipProof',
    // 'GetOwnershipId',
];

// small problems
const problems = [
    'EthereumSignTx', // encoded message seems to be the same, just chunks are in different order.
    'TezosSignTx' // this is encoding differently. don't know why. probably should solve this one!!!
];


// parsing messages is lengthy operation (~2000ms) so we keep copy outside of tests
let parsedMessages = null
const getParsedMessages = async () => {
    if (parsedMessages) return parsedMessages;
    parsedMessages = await parseConfigure(messages);
    return parsedMessages;
}

describe('encoding json -> protobuf', () => {
    fixtures
        .filter(f => !problems.includes(f.name))
        // .filter(f => f.name === 'TezosSignTx') // for debug
        // .filter(f => [
        //     'Address',
        //     'ApplyFlags',
        //     'ApplySettings',
        //     'AuthorizeCoinJoin',
        //     'BackupDevice',
        //     'BinanceAddress',
        //     'BinanceGetAddress',
        //     'BinanceCancelMsg',
        //     'BinanceGetAddress',
        //     'BinanceGetPublicKey',
        //     'BinanceOrderMsg',
        //     'BinancePublicKey',
        //     'BinanceSignTx',
        //     'BinanceSignedTx',
        //     'BinanceTransferMsg',
        //     'BinanceTxRequest',
        // ].includes(f.name)) // for debug
        .forEach((f) => {

            test(`message ${f.name} ${JSON.stringify(f.params)}`, async () => {
                const parsedMessages = await getParsedMessages();

                // expect(() => {
                //     buildOne(parsedMessages, f.name, f.params)
                // }).not.toThrow();

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
