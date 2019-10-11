/**
 * @jest-environment jsdom
 */
const parseConfigure = require('../src/lowlevel/protobuf/parse_protocol-new').parseConfigure
const buildOne = require('../src/lowlevel/send-new').buildOne;
const receiveOne = require('../src/lowlevel/receive-new').receiveOne;

const messages = require('../messages.json');
const fixtures = require('./__fixtures__/messages');

// parsing messages is lengthy operation (~2000ms) so we keep copy outside of tests
let parsedMessages = null
const getParsedMessages = async () => {
    if (parsedMessages) return parsedMessages;
    parsedMessages = parseConfigure(messages);
    return parsedMessages;
}

describe('encoding json -> protobuf', () => {
    fixtures
        // .filter(f => ['WebAuthnRemoveResidentCredential', 'EthereumMessageSignature'].includes(f.name)) // for debug
        .forEach((f) => {

            test(`message ${f.name} ${JSON.stringify(f.params)}`, async () => {
                const parsedMessages = await getParsedMessages();

                // first encoded message and save its snapshot, this will be useful 
                // when we start refactoring.
                const encodedMessage = buildOne(parsedMessages, f.name, f.params)
                // console.log('encodedMessage', encodedMessage);
                expect(encodedMessage.toString('hex')).toMatchSnapshot();

                // then decode message and check, whether decoded message matches original json
                const decodedMessage = receiveOne(parsedMessages, encodedMessage);

                expect(decodedMessage.type).toEqual(f.name);
                expect(decodedMessage.message).toEqual(f.params);
            });
        })
})
