
const messageToJSONOld = require('../src/lowlevel/protobuf/message_decoder').messageToJSON

const patchOld = require('../src/lowlevel/protobuf/monkey_patch').patch;

const encode = require('../src/lowlevel/protobuf/encoder').encode;
const decode = require('../src/lowlevel/protobuf/decoder').decode;

const ProtoBufOld = require("protobufjs-old-fixed-webpack");
const ProtoBufNew = require("protobufjs");

patchOld();


const fixtures = [

    {
        name: 'Initialize',
        messageOld: [{
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
        messageNew: {
            "Initialize": {
                "fields": {
                    "session_id": {
                        "type": "bytes",
                        "id": 0
                    }
                }
            },
        },
        in: {},
        encoded: '',
        out: { session_id: null }
    },
    {
        name: 'Address',
        messageOld: [{
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
        messageNew: {
            "Address": {
                "fields": {
                    "address": {
                        "rule": "required",
                        "type": "string",
                        "id": 1
                    }
                }
            },
        },
        in: { address: 'abcd' },
        encoded: '0a0461626364',
        out: { address: 'abcd' }
    },

    // todo: this is failing with old lib? ? 

    // {
    //     name: 'GetAddress',
    //     messageOld: [{
    //         "name": "GetAddress",
    //         "fields": [
    //             {
    //                 "rule": "repeated",
    //                 "options": {},
    //                 "type": "uint32",
    //                 "name": "address_n",
    //                 "id": 1
    //             },
    //             {
    //                 "rule": "optional",
    //                 "options": {
    //                     "default": "Bitcoin"
    //                 },
    //                 "type": "string",
    //                 "name": "coin_name",
    //                 "id": 2
    //             },
    //             {
    //                 "rule": "optional",
    //                 "options": {},
    //                 "type": "bool",
    //                 "name": "show_display",
    //                 "id": 3
    //             },
    //             {
    //                 "rule": "optional",
    //                 "options": {},
    //                 "type": "MultisigRedeemScriptType",
    //                 "name": "multisig",
    //                 "id": 4
    //             },
    //             // {
    //             //     "rule": "optional",
    //             //     "options": {
    //             //         "default": "SPENDADDRESS"
    //             //     },
    //             //     "type": "InputScriptType",
    //             //     "name": "script_type",
    //             //     "id": 5
    //             // },
    //             {
    //                 "rule": "optional",
    //                 "options": {},
    //                 "type": "bool",
    //                 "name": "ignore_xpub_magic",
    //                 "id": 6
    //             }
    //         ],
    //         "enums": [],
    //         "messages": [],
    //         "options": {},
    //         "oneofs": {}
    //     }, {
    //         "name": "MultisigRedeemScriptType",
    //         "fields": [
    //             {
    //                 "rule": "repeated",
    //                 "options": {},
    //                 "type": "HDNodePathType",
    //                 "name": "pubkeys",
    //                 "id": 1
    //             },
    //             {
    //                 "rule": "repeated",
    //                 "options": {},
    //                 "type": "bytes",
    //                 "name": "signatures",
    //                 "id": 2
    //             },
    //             {
    //                 "rule": "required",
    //                 "options": {},
    //                 "type": "uint32",
    //                 "name": "m",
    //                 "id": 3
    //             },
    //             {
    //                 "rule": "repeated",
    //                 "options": {},
    //                 "type": "HDNodeType",
    //                 "name": "nodes",
    //                 "id": 4
    //             },
    //             {
    //                 "rule": "repeated",
    //                 "options": {},
    //                 "type": "uint32",
    //                 "name": "address_n",
    //                 "id": 5
    //             }
    //         ],
    //         "enums": [],
    //         "messages": [
    //             {
    //                 "name": "HDNodePathType",
    //                 "fields": [
    //                     {
    //                         "rule": "required",
    //                         "options": {},
    //                         "type": "HDNodeType",
    //                         "name": "node",
    //                         "id": 1
    //                     },
    //                     {
    //                         "rule": "repeated",
    //                         "options": {},
    //                         "type": "uint32",
    //                         "name": "address_n",
    //                         "id": 2
    //                     }
    //                 ],
    //                 "enums": [],
    //                 "messages": [],
    //                 "options": {},
    //                 "oneofs": {}
    //             }
    //         ],
    //         "options": {},
    //         "oneofs": {}
    //     }, {
    //         "name": "HDNodeType",
    //         "fields": [
    //             {
    //                 "rule": "required",
    //                 "options": {},
    //                 "type": "uint32",
    //                 "name": "depth",
    //                 "id": 1
    //             },
    //             {
    //                 "rule": "required",
    //                 "options": {},
    //                 "type": "uint32",
    //                 "name": "fingerprint",
    //                 "id": 2
    //             },
    //             {
    //                 "rule": "required",
    //                 "options": {},
    //                 "type": "uint32",
    //                 "name": "child_num",
    //                 "id": 3
    //             },
    //             {
    //                 "rule": "required",
    //                 "options": {},
    //                 "type": "bytes",
    //                 "name": "chain_code",
    //                 "id": 4
    //             },
    //             {
    //                 "rule": "optional",
    //                 "options": {},
    //                 "type": "bytes",
    //                 "name": "private_key",
    //                 "id": 5
    //             },
    //             {
    //                 "rule": "required",
    //                 "options": {},
    //                 "type": "bytes",
    //                 "name": "public_key",
    //                 "id": 6
    //             }
    //         ],
    //         "enums": [],
    //         "messages": [],
    //         "options": {},
    //         "oneofs": {}
    //     }],
    //     messageNew: {
    //         "GetAddress": {
    //             "fields": {
    //                 "address_n": {
    //                     "rule": "repeated",
    //                     "type": "uint32",
    //                     "id": 1,
    //                     "options": {
    //                         "packed": false
    //                     }
    //                 },
    //                 "coin_name": {
    //                     "type": "string",
    //                     "id": 2,
    //                     "options": {
    //                         "default": "Bitcoin"
    //                     }
    //                 },
    //                 "show_display": {
    //                     "type": "bool",
    //                     "id": 3
    //                 },
    //                 "multisig": {
    //                     "type": "MultisigRedeemScriptType",
    //                     "id": 4
    //                 },
    //                 // "script_type": {
    //                 //     "type": "InputScriptType",
    //                 //     "id": 5,
    //                 //     "options": {
    //                 //         "default": "SPENDADDRESS"
    //                 //     }
    //                 // },
    //                 "ignore_xpub_magic": {
    //                     "type": "bool",
    //                     "id": 6
    //                 }
    //             }
    //         },
    //         "MultisigRedeemScriptType": {
    //             "fields": {
    //                 "pubkeys": {
    //                     "rule": "repeated",
    //                     "type": "HDNodePathType",
    //                     "id": 1
    //                 },
    //                 "signatures": {
    //                     "rule": "repeated",
    //                     "type": "bytes",
    //                     "id": 2
    //                 },
    //                 "m": {
    //                     "rule": "required",
    //                     "type": "uint32",
    //                     "id": 3
    //                 },
    //                 "nodes": {
    //                     "rule": "repeated",
    //                     "type": "HDNodeType",
    //                     "id": 4
    //                 },
    //                 "address_n": {
    //                     "rule": "repeated",
    //                     "type": "uint32",
    //                     "id": 5,
    //                     "options": {
    //                         "packed": false
    //                     }
    //                 }
    //             },
    //             "nested": {
    //                 "HDNodePathType": {
    //                     "fields": {
    //                         "node": {
    //                             "rule": "required",
    //                             "type": "HDNodeType",
    //                             "id": 1
    //                         },
    //                         "address_n": {
    //                             "rule": "repeated",
    //                             "type": "uint32",
    //                             "id": 2,
    //                             "options": {
    //                                 "packed": false
    //                             }
    //                         }
    //                     }
    //                 }
    //             }
    //         },
    //         "HDNodeType": {
    //             "fields": {
    //                 "depth": {
    //                     "rule": "required",
    //                     "type": "uint32",
    //                     "id": 1
    //                 },
    //                 "fingerprint": {
    //                     "rule": "required",
    //                     "type": "uint32",
    //                     "id": 2
    //                 },
    //                 "child_num": {
    //                     "rule": "required",
    //                     "type": "uint32",
    //                     "id": 3
    //                 },
    //                 "chain_code": {
    //                     "rule": "required",
    //                     "type": "bytes",
    //                     "id": 4
    //                 },
    //                 "private_key": {
    //                     "type": "bytes",
    //                     "id": 5
    //                 },
    //                 "public_key": {
    //                     "rule": "required",
    //                     "type": "bytes",
    //                     "id": 6
    //                 }
    //             }
    //         }
    //     },
    //     in: {
    //         address_n: [1],
    //         coin_name: 'btc',
    //         show_display: null,
    //         ignore_xpub_magic: null,
    //         multisig: {
    //             pubkeys: [{
    //                 node: {
    //                     depth: 1,
    //                     fingerprint: 1,
    //                     child_num: 1,
    //                     chain_code: '851fc9542342321af63ecbba7d3ece545f2a42bad01ba32cff5535b18e54b6d3106e10b6a4525993d185a1443d9a125186960e028eabfdd8d76cf70a3a7e3100',
    //                     private_key: '851fc9542342321af63ecbba7d3ece545f2a42bad01ba32cff5535b18e54b6d3106e10b6a4525993d185a1443d9a125186960e028eabfdd8d76cf70a3a7e3100',
    //                     public_key: '851fc9542342321af63ecbba7d3ece545f2a42bad01ba32cff5535b18e54b6d3106e10b6a4525993d185a1443d9a125186960e028eabfdd8d76cf70a3a7e3100',
    //                 },
    //                 address_n: [1]
    //             }],
    //             signatures: ['851fc9542342321af63ecbba7d3ece545f2a42bad01ba32cff5535b18e54b6d3106e10b6a4525993d185a1443d9a125186960e028eabfdd8d76cf70a3a7e3100'],
    //             m: 1,
    //             nodes: [{
    //                 depth: 1,
    //                 fingerprint: 1,
    //                 child_num: 1,
    //                 chain_code: '851fc9542342321af63ecbba7d3ece545f2a42bad01ba32cff5535b18e54b6d3106e10b6a4525993d185a1443d9a125186960e028eabfdd8d76cf70a3a7e3100',
    //                 private_key: '851fc9542342321af63ecbba7d3ece545f2a42bad01ba32cff5535b18e54b6d3106e10b6a4525993d185a1443d9a125186960e028eabfdd8d76cf70a3a7e3100',
    //                 public_key: '851fc9542342321af63ecbba7d3ece545f2a42bad01ba32cff5535b18e54b6d3106e10b6a4525993d185a1443d9a125186960e028eabfdd8d76cf70a3a7e3100',
    //             }],
    //             address_n: [1],
    //         },
    //     },
    //     encoded: '0801120362746322e9030ad1010acc010801100118012240851fc9542342321af63ecbba7d3ece545f2a42bad01ba32cff5535b18e54b6d3106e10b6a4525993d185a1443d9a125186960e028eabfdd8d76cf70a3a7e31002a40851fc9542342321af63ecbba7d3ece545f2a42bad01ba32cff5535b18e54b6d3106e10b6a4525993d185a1443d9a125186960e028eabfdd8d76cf70a3a7e31003240851fc9542342321af63ecbba7d3ece545f2a42bad01ba32cff5535b18e54b6d3106e10b6a4525993d185a1443d9a125186960e028eabfdd8d76cf70a3a7e310010011240851fc9542342321af63ecbba7d3ece545f2a42bad01ba32cff5535b18e54b6d3106e10b6a4525993d185a1443d9a125186960e028eabfdd8d76cf70a3a7e3100180122cc010801100118012240851fc9542342321af63ecbba7d3ece545f2a42bad01ba32cff5535b18e54b6d3106e10b6a4525993d185a1443d9a125186960e028eabfdd8d76cf70a3a7e31002a40851fc9542342321af63ecbba7d3ece545f2a42bad01ba32cff5535b18e54b6d3106e10b6a4525993d185a1443d9a125186960e028eabfdd8d76cf70a3a7e31003240851fc9542342321af63ecbba7d3ece545f2a42bad01ba32cff5535b18e54b6d3106e10b6a4525993d185a1443d9a125186960e028eabfdd8d76cf70a3a7e31002801',
    // },
    {
        name: 'TxRequest',
        messageOld: [{
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
        messageNew: {
            "TxRequest": {
                "fields": {
                    "request_type": {
                        "type": "RequestType",
                        "id": 1
                    },
                    "details": {
                        "type": "TxRequestDetailsType",
                        "id": 2
                    },
                    "serialized": {
                        "type": "TxRequestSerializedType",
                        "id": 3
                    }
                },
                "nested": {
                    "RequestType": {
                        "values": {
                            "TXINPUT": 0,
                            "TXOUTPUT": 1,
                            "TXMETA": 2,
                            "TXFINISHED": 3,
                            "TXEXTRADATA": 4,
                            "TXORIGINPUT": 5,
                            "TXORIGOUTPUT": 6
                        }
                    },
                    "TxRequestDetailsType": {
                        "fields": {
                            "request_index": {
                                "type": "uint32",
                                "id": 1
                            },
                            "tx_hash": {
                                "type": "bytes",
                                "id": 2
                            },
                            "extra_data_len": {
                                "type": "uint32",
                                "id": 3
                            },
                            "extra_data_offset": {
                                "type": "uint32",
                                "id": 4
                            }
                        }
                    },
                    "TxRequestSerializedType": {
                        "fields": {
                            "signature_index": {
                                "type": "uint32",
                                "id": 1
                            },
                            "signature": {
                                "type": "bytes",
                                "id": 2
                            },
                            "serialized_tx": {
                                "type": "bytes",
                                "id": 3
                            }
                        }
                    }
                }
            },
        },
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

            const MessagesOld = ProtoBufOld.newBuilder({})[`import`]({ messages: [...f.messageOld] }).build();
            const MessagesNew = ProtoBufNew.Root.fromJSON({ nested: { messages: { nested: { ...f.messageNew } } } });

            const MessageOld = MessagesOld[f.name];
            const MessageNew = MessagesNew.lookup(`messages.${f.name}`);

            test('old way', () => {
                const messageOld = new MessageOld(f.in);
                const encodedOld = messageOld.encodeAB();
                expect(Buffer.from(encodedOld).toString('hex')).toEqual(f.encoded);

                // deserialize
                const decodedOld = messageToJSONOld(MessageOld.decode(encodedOld));

                expect(decodedOld).toEqual(f.out ? f.out : f.in);
            })

            test('new way', () => {
                // serialize new way - this is to confirm new lib won't break old behavior

                const encodedNew = encode(MessageNew, f.in);
                expect(encodedNew.toString('hex')).toEqual(f.encoded);
                // deserialize new way - this is to confirm new lib won't break old behavior
             
                const decodedNew = decode(MessageNew, encodedNew);
                expect(decodedNew).toEqual(f.out ? f.out : f.in);
            });
        })

    })
})
