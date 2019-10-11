
const messageToJSONOld = require('../src/lowlevel/protobuf/message_decoder').messageToJSON
const messageToJSONNew = require('../src/lowlevel/protobuf/message_decoder-new').messageToJSON

const patchOld = require('../src/lowlevel/protobuf/monkey_patch').patch;
const patchNew = require('../src/lowlevel/protobuf/monkey_patch-new').patch;

import * as ProtoBufOld from "protobufjs-old-fixed-webpack";
import * as ProtoBufNew from "protobufjs";

patchOld();


// ProtoBufNew.Reflect.Message.Field.prototype.verifyValueOriginal = ProtoBufNew.Reflect.Message.Field.prototype.verifyValue;

// // note: don't rewrite this function to arrow (value, skipRepeated) => ....
// // since I need `this` from the original context
// ProtoBufNew.Reflect.Message.Field.prototype.verifyValue = function (value, skipRepeated) {
//   let newValue = value;
//   if (this.type === ProtoBufNew.TYPES[`bytes`]) {
//     if (value != null) {
//       if (typeof value === `string`) {
//         newValue = ByteBuffer.wrap(value, `hex`);
//       }
//     }
//   }
//   return this.verifyValueOriginal(newValue, skipRepeated);
// };

const messagesOld = {
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
        }
    ]

}

const messagesNew = {
    "nested": {
        "messages": {
            "nested": {
                "String": {
                    "fields": {
                        "field": {
                            "rule": "required",
                            "type": "string",
                            "id": 1
                        }
                    }
                },
                "Uint32": {
                    "fields": {
                        "field": {
                            "rule": "required",
                            "type": "uint32",
                            "id": 2
                        }
                    }
                },
                "Uint64": {
                    "fields": {
                        "field": {
                            "rule": "required",
                            "type": "uint64",
                            "id": 3
                        }
                    }
                },
                "Bool": {
                    "fields": {
                        "field": {
                            "rule": "required",
                            "type": "bool",
                            "id": 4
                        }
                    }
                },
                "Sint32": {
                    "fields": {
                        "field": {
                            "rule": "required",
                            "type": "sint32",
                            "id": 5
                        }
                    }
                },
                "Sint64": {
                    "fields": {
                        "field": {
                            "rule": "required",
                            "type": "sint64",
                            "id": 6
                        }
                    }
                },
                "Bytes": {
                    "fields": {
                        "field": {
                            "rule": "required",
                            "type": "bytes",
                            "id": 7
                        }
                    }
                },

            }
        }
    }
}

const fixtures = [
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

describe('primitives encode/decode using old/new lib', () => {
    const MessagesOld = ProtoBufOld.newBuilder({})[`import`](messagesOld).build();
    const MessagesNew = ProtoBufNew.Root.fromJSON(messagesNew);

    fixtures.forEach(f => {
        describe(f.name, () => {
            const MessageOld = MessagesOld[f.name];
            const MessageNew = MessagesNew.lookup(`messages.${f.name}`);

            test('old way', async () => {
                // serialize old way - this is to confirm fixtures match old behavior
                const messageOld = new MessageOld(f.params);
                const encodedOld = messageOld.encodeAB();
                expect(Buffer.from(encodedOld).toString('hex')).toEqual(f.encoded);

                // deserialize
                const decodedOld = messageToJSONOld(MessageOld.decode(encodedOld));
                expect(decodedOld).toEqual(f.params);
            });

            test('new way', () => {
                // serialize new way - this is to confirm new lib won't break old behavior
            
                const params = patchNew(MessageNew, f.params);
                const messageNew = MessageNew.fromObject(params);
                const encodedNew = MessageNew.encode(messageNew).finish();
                expect(encodedNew.toString('hex')).toEqual(f.encoded);

                // deserialize new way - this is to confirm new lib won't break old behavior
                const decodedNew = messageToJSONNew(MessageNew.decode(encodedNew));
                expect(decodedNew).toEqual(f.params);
            });

        })

    })

})