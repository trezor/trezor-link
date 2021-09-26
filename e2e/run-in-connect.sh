#!/usr/bin/env bash

# This script runs trezor-connect tests against current version of trezor-link

set -euo pipefail

# setup trezor-connect
cd connect
yarn
yarn add protobufjs
yarn pbjs -t json -p ./submodules/trezor-common/protob -o messages.json --keep-case messages-binance.proto messages-bitcoin.proto messages-bootloader.proto messages-cardano.proto messages-common.proto messages-crypto.proto messages-debug.proto messages-eos.proto messages-ethereum.proto messages-management.proto messages-monero.proto messages-nem.proto messages-ripple.proto messages-stellar.proto messages-tezos.proto messages-webauthn.proto messages.proto
cp messages.json src/data/messages/messages.json
yarn build:npm

# stub trezor-link into trezor-connect
rm -rf ./node_modules/trezor-link/lib 
cp -rf ../lib ../node_modules/trezor-link 
cp ../yarn.lock ../package.json ../node_modules/trezor-link 
cd ./node_modules/trezor-link
cd ../../

# run integration tests in trezor-connect
./tests/run.sh
