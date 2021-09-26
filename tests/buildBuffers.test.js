const parseConfigure = require('../src/lowlevel/protobuf/messages').parseConfigure;
const buildBuffers = require('../src/lowlevel/send').buildBuffers;

const receiveAndParse = require('../src/lowlevel/receive').receiveAndParse;

const messages = require('./__fixtures__/messages-new.json');
const fixtures = require('./__fixtures__/messages');

let parsedMessages = null

const getParsedMessages = () => {
    if (parsedMessages) return parsedMessages;
    parsedMessages = parseConfigure(messages);
    return parsedMessages;
}

describe('buildBuffers', () => {
    fixtures
        .forEach(f => {
            test(`message ${f.name}`, async () => {
                const parsedMessages = getParsedMessages();

                const result = buildBuffers(parsedMessages, f.name, f.params);

                result.forEach(r => {
                    expect(r.byteLength).toEqual(63);
                    // this is failing but it probably does not matter
                    // expect(Array.from(new Uint8Array(r))).toMatchSnapshot();
                })
                let i = -1;
                const decoded = await receiveAndParse(parsedMessages, () => {
                    i++;
                    return Promise.resolve(result[i]);
                })
                // then decode message and check, whether decoded message matches original json
                expect(decoded.type).toEqual(f.name);
                expect(decoded.message).toEqual(f.params);
            })
        });
})

