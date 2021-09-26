const ProtoBuf = require("protobufjs-old-fixed-webpack");

const messageToJSON = require('../src/lowlevel/protobuf/message_decoder.js').messageToJSON
const patch = require('../src/lowlevel/protobuf/monkey_patch.js').patch;

patch();

const fixtures = [

    {
        name: 'Initialize',
        message: [{
            "name": "Initialize",
            "fields": [
                {
                    "rule": "optional",
                    "options": {},
                    "type": "bytes",
                    "name": "session_id",
                    "id": 0
                }
            ],
        }],
        in: {},
        encoded: '',
        out: { session_id: null }
    },
    {
        name: 'Address',
        message: [{
            "name": "Address",
            "fields": [
                {
                    "rule": "required",
                    "options": {},
                    "type": "string",
                    "name": "address",
                    "id": 1
                }
            ],
            "enums": [],
            "messages": [],
            "options": {},
            "oneofs": {}
        }],
        in: { address: 'abcd' },
        encoded: '0a0461626364',
        out: { address: 'abcd' }
    },
    {
        name: 'TxRequest',
        message: [{
            "name": "TxRequest",
            "fields": [
                {
                    "rule": "optional",
                    "options": {},
                    "type": "RequestType",
                    "name": "request_type",
                    "id": 1
                },
                {
                    "rule": "optional",
                    "options": {},
                    "type": "TxRequestDetailsType",
                    "name": "details",
                    "id": 2
                },
                {
                    "rule": "optional",
                    "options": {},
                    "type": "TxRequestSerializedType",
                    "name": "serialized",
                    "id": 3
                }
            ],
            "enums": [
                {
                    "name": "RequestType",
                    "values": [
                        {
                            "name": "TXINPUT",
                            "id": 0
                        },
                        {
                            "name": "TXOUTPUT",
                            "id": 1
                        },
                        {
                            "name": "TXMETA",
                            "id": 2
                        },
                        {
                            "name": "TXFINISHED",
                            "id": 3
                        },
                        {
                            "name": "TXEXTRADATA",
                            "id": 4
                        },
                        {
                            "name": "TXORIGINPUT",
                            "id": 5
                        },
                        {
                            "name": "TXORIGOUTPUT",
                            "id": 6
                        }
                    ],
                    "options": {}
                }
            ],
            "messages": [
                {
                    "name": "TxRequestDetailsType",
                    "fields": [
                        {
                            "rule": "optional",
                            "options": {},
                            "type": "uint32",
                            "name": "request_index",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "options": {},
                            "type": "bytes",
                            "name": "tx_hash",
                            "id": 2
                        },
                        {
                            "rule": "optional",
                            "options": {},
                            "type": "uint32",
                            "name": "extra_data_len",
                            "id": 3
                        },
                        {
                            "rule": "optional",
                            "options": {},
                            "type": "uint32",
                            "name": "extra_data_offset",
                            "id": 4
                        }
                    ],
                    "enums": [],
                    "messages": [],
                    "options": {},
                    "oneofs": {}
                },
                {
                    "name": "TxRequestSerializedType",
                    "fields": [
                        {
                            "rule": "optional",
                            "options": {},
                            "type": "uint32",
                            "name": "signature_index",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "options": {},
                            "type": "bytes",
                            "name": "signature",
                            "id": 2
                        },
                        {
                            "rule": "optional",
                            "options": {},
                            "type": "bytes",
                            "name": "serialized_tx",
                            "id": 3
                        }
                    ],
                    "enums": [],
                    "messages": [],
                    "options": {},
                    "oneofs": {}
                }
            ],
            "options": {},
            "oneofs": {}
        }],
        in: {
            request_type: 0,
            details: { request_index: 0 },
            serialized: {
                serialized_tx: '851fc9542342321af63ecbba7d3ece545f2a42bad01ba32cff5535b18e54b6d3106e10b6a4525993d185a1443d9a125186960e028eabfdd8d76cf70a3a7e3100'
            },

        },
        encoded: '0800120208001a421a40851fc9542342321af63ecbba7d3ece545f2a42bad01ba32cff5535b18e54b6d3106e10b6a4525993d185a1443d9a125186960e028eabfdd8d76cf70a3a7e3100',
        out: {
            request_type: "TXINPUT",
            details: {
                request_index: 0,
                tx_hash: null,
                extra_data_len: null,
                extra_data_offset: null,
            },
            serialized: {
                serialized_tx: '851fc9542342321af63ecbba7d3ece545f2a42bad01ba32cff5535b18e54b6d3106e10b6a4525993d185a1443d9a125186960e028eabfdd8d76cf70a3a7e3100',
                signature: null,
                signature_index: null,
            },
        },
    }
]

describe('basic concepts', () => {
    fixtures.forEach(f => {
        describe(f.name, () => {

            const Messages = ProtoBuf.newBuilder({})[`import`]({ messages: [...f.message] }).build();
            const Message = Messages[f.name];

            test('encode and decode', () => {
                const message = new Message(f.in);
                const encoded = message.encodeAB();
                expect(Buffer.from(encoded).toString('hex')).toEqual(f.encoded);

                // deserialize
                const decoded = messageToJSON(Message.decode(encoded));
                expect(decoded).toEqual(f.out ? f.out : f.in);
            })
        })
    })
})
