# Goals:

1. Update libs, use typescript, keep API intact
1. Next steps? Discuss

# Steps:

## 1. Write tests

### Unit

To make sure we don't break anything regarding encoding / decoding protobuf messages. 
Old code was used to generated snapshots of encoded messages. 

```
yarn test:unit
```

### Integration

Just to make sure that connection to trezord-go works (question: what about other transports?)

```
yarn test:integration
```

## 2. Upgrade libs

- change [protobufjs-old-fixed-webpack](https://www.npmjs.com/package/protobufjs-old-fixed-webpack) to [protobuf.js](https://github.com/protobufjs/protobuf.js) 
- add [bytebuffer](https://github.com/protobufjs/bytebuffer.js)
- todo: remove unused dependencies (bigi?)
- todo: update dependencies

## Notes

- Seems like protobuf.js expects messages descriptors in a different format than we used previously. Before: 

```
{
    "messages": [
        {
            "name": "BinanceGetAddress",
            "fields": [
                {
                    "rule": "repeated",
                    "options": {},
                    "type": "uint32",
                    "name": "address_n",
                    "id": 1
                },
                {
                    "rule": "optional",
                    "options": {},
                    "type": "bool",
                    "name": "show_display",
                    "id": 2
                }
            ],
            "enums": [],
            "messages": [],
            "options": {},
            "oneofs": {}
        }
    ]
}
```

after

```
{
  "nested": {
    "hw": {
      "nested": {
        "trezor": {
          "nested": {
            "messages": {
                "binance": {
                    "options": {
                        "java_package": "com.satoshilabs.trezor.lib.protobuf",
                        "java_outer_classname": "TrezorMessageBinance"
                    },
                    "nested": {
                        "BinanceGetAddress": {
                            "fields": {
                              "address_n": {
                                "rule": "repeated",
                                "type": "uint32",
                                "id": 1,
                                "options": {
                                  "packed": false
                                }
                              },
                              "show_display": {
                                "type": "bool",
                                "id": 2
                              }
                            }
                        }
                    }
                }
            }      
        }
    }
}
```

We can get the new output by using 

```
yarn pbjs -t json -p <path to trezor common protobuf folder> -o messages.json --keep-case messages-binance.proto messages-bitcoin.proto messages-bootloader.proto messages-cardano.proto messages-common.proto messages-crypto.proto messages-debug.proto messages-eos.proto messages-ethereum.proto messages-lisk.proto messages-management.proto messages-monero.proto messages-nem.proto messages-ripple.proto messages-stellar.proto messages-tezos.proto messages-webauthn.proto messages.proto > messages.json

```