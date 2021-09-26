const parseConfigure = require('../src/lowlevel/protobuf/parse_protocol').parseConfigure;
const buildOne = require('../src/lowlevel/send').buildOne;
const receiveOne = require('../src/lowlevel/receive').receiveOne;

const messages = require('./__fixtures__/messages-new.json');
const fixtures = require('./__fixtures__/messages');

// parsing messages is lengthy operation (~2000ms) so we keep copy outside of tests
let parsedMessages = null
const getParsedMessages = async () => {
    if (parsedMessages) return parsedMessages;
    parsedMessages = await parseConfigure(messages);
    return parsedMessages;
}

describe('encoding json -> protobuf', () => {
    fixtures
        .forEach(f => {
            test(`message ${f.name} ${JSON.stringify(f.params)}`, async () => {

            const parsedMessages = await getParsedMessages();
                const encodedMessage = buildOne(parsedMessages, f.name, f.params)

                // todo: this is failing but it looks like only that 
                // message chunks are the same just ordered differently
                expect(encodedMessage.toString('hex')).toMatchSnapshot();

                // then decode message and check, whether decoded message matches original json
                const decodedMessage = receiveOne(parsedMessages, encodedMessage);
                expect(decodedMessage.type).toEqual(f.name);
                expect(decodedMessage.message).toEqual(f.params);
            });
        });
})
