const ProtoBuf = require("protobufjs");

const encode = require('../src/lowlevel/protobuf/encoder').encode;
const decode = require('../src/lowlevel/protobuf/decoder').decode;

const fixtures = [
    {
        name: 'Initialize',
        message: {
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
        message: {
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

    {
        name: 'GetAddress',
        message: {
            "GetAddress": {
                "fields": {
                    "address_n": {
                        "rule": "repeated",
                        "type": "uint32",
                        "id": 1,
                        "options": {
                            "packed": false
                        }
                    },
                    "coin_name": {
                        "type": "string",
                        "id": 2,
                        "options": {
                            "default": "Bitcoin"
                        }
                    },
                    "show_display": {
                        "type": "bool",
                        "id": 3
                    },
                    "multisig": {
                        "type": "MultisigRedeemScriptType",
                        "id": 4
                    },
                    "ignore_xpub_magic": {
                        "type": "bool",
                        "id": 6
                    }
                }
            },
            "MultisigRedeemScriptType": {
                "fields": {
                    "pubkeys": {
                        "rule": "repeated",
                        "type": "HDNodePathType",
                        "id": 1
                    },
                    "signatures": {
                        "rule": "repeated",
                        "type": "bytes",
                        "id": 2
                    },
                    "m": {
                        "rule": "required",
                        "type": "uint32",
                        "id": 3
                    },
                    "nodes": {
                        "rule": "repeated",
                        "type": "HDNodeType",
                        "id": 4
                    },
                    "address_n": {
                        "rule": "repeated",
                        "type": "uint32",
                        "id": 5,
                        "options": {
                            "packed": false
                        }
                    }
                },
                "nested": {
                    "HDNodePathType": {
                        "fields": {
                            "node": {
                                "rule": "required",
                                "type": "HDNodeType",
                                "id": 1
                            },
                            "address_n": {
                                "rule": "repeated",
                                "type": "uint32",
                                "id": 2,
                                "options": {
                                    "packed": false
                                }
                            }
                        }
                    }
                }
            },
            "HDNodeType": {
                "fields": {
                    "depth": {
                        "rule": "required",
                        "type": "uint32",
                        "id": 1
                    },
                    "fingerprint": {
                        "rule": "required",
                        "type": "uint32",
                        "id": 2
                    },
                    "child_num": {
                        "rule": "required",
                        "type": "uint32",
                        "id": 3
                    },
                    "chain_code": {
                        "rule": "required",
                        "type": "bytes",
                        "id": 4
                    },
                    "private_key": {
                        "type": "bytes",
                        "id": 5
                    },
                    "public_key": {
                        "rule": "required",
                        "type": "bytes",
                        "id": 6
                    }
                }
            }
        },
        in: {
            address_n: [1],
            coin_name: 'btc',
            show_display: null,
            ignore_xpub_magic: null,
            multisig: {
                pubkeys: [{
                    node: {
                        depth: 1,
                        fingerprint: 1,
                        child_num: 1,
                        chain_code: '851fc9542342321af63ecbba7d3ece545f2a42bad01ba32cff5535b18e54b6d3106e10b6a4525993d185a1443d9a125186960e028eabfdd8d76cf70a3a7e3100',
                        private_key: '851fc9542342321af63ecbba7d3ece545f2a42bad01ba32cff5535b18e54b6d3106e10b6a4525993d185a1443d9a125186960e028eabfdd8d76cf70a3a7e3100',
                        public_key: '851fc9542342321af63ecbba7d3ece545f2a42bad01ba32cff5535b18e54b6d3106e10b6a4525993d185a1443d9a125186960e028eabfdd8d76cf70a3a7e3100',
                    },
                    address_n: [1]
                }],
                signatures: ['851fc9542342321af63ecbba7d3ece545f2a42bad01ba32cff5535b18e54b6d3106e10b6a4525993d185a1443d9a125186960e028eabfdd8d76cf70a3a7e3100'],
                m: 1,
                nodes: [{
                    depth: 1,
                    fingerprint: 1,
                    child_num: 1,
                    chain_code: '851fc9542342321af63ecbba7d3ece545f2a42bad01ba32cff5535b18e54b6d3106e10b6a4525993d185a1443d9a125186960e028eabfdd8d76cf70a3a7e3100',
                    private_key: '851fc9542342321af63ecbba7d3ece545f2a42bad01ba32cff5535b18e54b6d3106e10b6a4525993d185a1443d9a125186960e028eabfdd8d76cf70a3a7e3100',
                    public_key: '851fc9542342321af63ecbba7d3ece545f2a42bad01ba32cff5535b18e54b6d3106e10b6a4525993d185a1443d9a125186960e028eabfdd8d76cf70a3a7e3100',
                }],
                address_n: [1],
            },
        },
        encoded: '0801120362746322e9030ad1010acc010801100118012240851fc9542342321af63ecbba7d3ece545f2a42bad01ba32cff5535b18e54b6d3106e10b6a4525993d185a1443d9a125186960e028eabfdd8d76cf70a3a7e31002a40851fc9542342321af63ecbba7d3ece545f2a42bad01ba32cff5535b18e54b6d3106e10b6a4525993d185a1443d9a125186960e028eabfdd8d76cf70a3a7e31003240851fc9542342321af63ecbba7d3ece545f2a42bad01ba32cff5535b18e54b6d3106e10b6a4525993d185a1443d9a125186960e028eabfdd8d76cf70a3a7e310010011240851fc9542342321af63ecbba7d3ece545f2a42bad01ba32cff5535b18e54b6d3106e10b6a4525993d185a1443d9a125186960e028eabfdd8d76cf70a3a7e3100180122cc010801100118012240851fc9542342321af63ecbba7d3ece545f2a42bad01ba32cff5535b18e54b6d3106e10b6a4525993d185a1443d9a125186960e028eabfdd8d76cf70a3a7e31002a40851fc9542342321af63ecbba7d3ece545f2a42bad01ba32cff5535b18e54b6d3106e10b6a4525993d185a1443d9a125186960e028eabfdd8d76cf70a3a7e31003240851fc9542342321af63ecbba7d3ece545f2a42bad01ba32cff5535b18e54b6d3106e10b6a4525993d185a1443d9a125186960e028eabfdd8d76cf70a3a7e31002801',
    },
    {
        name: 'TxRequest',
        message: {
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

            const Messages = ProtoBuf.Root.fromJSON({ nested: { messages: { nested: { ...f.message } } } });
            const Message = Messages.lookup(`messages.${f.name}`);

            test('encode and decode', () => {
                // serialize
                const encoded = encode(Message, f.in);
                expect(encoded.toString('hex')).toEqual(f.encoded);
                // deserialize
                const decoded = decode(Message, encoded);
                expect(decoded).toEqual(f.out ? f.out : f.in);
            })
        })
    })
})
