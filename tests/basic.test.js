
const messageToJSON = require('../src/lowlevel/protobuf/message_decoder.js').messageToJSON
const patch = require('../src/lowlevel/protobuf/monkey_patch.js').patch;

const ProtoBuf = require("protobufjs-old-fixed-webpack");

patch();

const messages = {
    messages: [
        {
            "name": "String",
            "fields": [
                {
                    "rule": "required",
                    "options": {},
                    "type": "string",
                    "name": "field",
                    "id": 1
                }
            ],
        },
        {
            "name": "Uint32",
            "fields": [
                {
                    "rule": "required",
                    "options": {},
                    "type": "uint32",
                    "name": "field",
                    "id": 2
                }
            ],
        },
        {
            "name": "Uint64",
            "fields": [
                {
                    "rule": "required",
                    "options": {},
                    "type": "uint64",
                    "name": "field",
                    "id": 3
                }
            ],
        },
        {
            "name": "Bool",
            "fields": [
                {
                    "rule": "required",
                    "options": {},
                    "type": "bool",
                    "name": "field",
                    "id": 4
                }
            ],
        },
        {
            "name": "Sint32",
            "fields": [
                {
                    "rule": "required",
                    "options": {},
                    "type": "sint32",
                    "name": "field",
                    "id": 5
                }
            ],
        },
        {
            "name": "Sint64",
            "fields": [
                {
                    "rule": "required",
                    "options": {},
                    "type": "sint64",
                    "name": "field",
                    "id": 6
                }
            ],
        },
        {
            "name": "Bytes",
            "fields": [
                {
                    "rule": "required",
                    "options": {},
                    "type": "bytes",
                    "name": "field",
                    "id": 7
                }
            ],
        },

        // complex and real life examples
        {
            "name": "ComplexFieldOfOptionals",
            "fields": [
                {
                    "rule": "optional",
                    "options": {},
                    "type": "bool",
                    "name": "bool",
                    "id": 8
                },
                {
                    "rule": "optional",
                    "options": {},
                    "type": "uint32",
                    "name": "number",
                    "id": 9
                }
            ],
        },
    ]
}

const basicFixtures = [
    {
        name: 'String',
        params: { field: 'foo' },
        encoded: '0a03666f6f',
    },
    {
        name: 'Uint32',
        params: { field: 4294967295 },
        encoded: '10ffffffff0f',
    },
    {
        name: 'Uint64',
        params: { field: 1844674407370955 },
        encoded: '18cba19cd68bb7a303',
    },
    {
        name: 'Bool',
        params: { field: true },
        encoded: '2001',
    },
    {
        name: 'Bool',
        params: { field: false },
        encoded: '2000',
    },
    {
        name: 'Sint32',
        params: { field: -4294967 },
        encoded: '28eda48c04',
    },
    {
        name: 'Sint64',
        params: { field: -1844674407370955 },
        encoded: '3095c3b8ac97eec606',
    },
    {
        name: 'Bytes',
        params: { field: '851fc9542342321af63ecbba7d3ece545f2a42bad01ba32cff5535b18e54b6d3106e10b6a4525993d185a1443d9a125186960e028eabfdd8d76cf70a3a7e3100' },
        encoded: '3a40851fc9542342321af63ecbba7d3ece545f2a42bad01ba32cff5535b18e54b6d3106e10b6a4525993d185a1443d9a125186960e028eabfdd8d76cf70a3a7e3100',
    }]


// note: difference in bool encoding. if type === bool && field = optional && not message of only one field, bool is encoded as ""
const advancedFixtures = [
    {
        name: 'ComplexFieldOfOptionals',
        in: { number: 1 },
        encoded: '4801',
        out: { bool: null, number: 1 },
    },
]

describe('basic concepts', () => {
    const Messages = ProtoBuf.newBuilder({})[`import`](messages).build();

    describe('primitives encode/decode', () => {
        basicFixtures.forEach(f => {
            describe(f.name, () => {
                const Message = Messages[f.name];

                test(f.name, async () => {
                    // serialize old way - this is to confirm fixtures match old behavior
                    const message = new Message(f.params);
                    const encoded = message.encodeAB();
                    expect(Buffer.from(encoded).toString('hex')).toEqual(f.encoded);

                    // deserialize
                    const decoded = messageToJSON(Message.decode(encoded));
                    expect(decoded).toEqual(f.params);
                });
            })
        })
    })

    describe('advanced', () => {
        advancedFixtures.forEach(f => {
            describe(f.name, () => {
                const Message = Messages[f.name];

                test(f.name, () => {
                    const message = new Message(f.in);
                    const encoded = message.encodeAB();
                    expect(Buffer.from(encoded).toString('hex')).toEqual(f.encoded);

                    // deserialize
                    const decoded = messageToJSON(Message.decode(encoded));
                    expect(decoded).toEqual(f.out);
                })
            })

        })
    })
})
