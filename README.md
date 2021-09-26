# trezor-link

[![Build Status](https://github.com/trezor/trezor-link/actions/workflows/tests.yml/badge.svg)](https://github.com/trezor/trezor-link/actions/workflows/tests.yml)
[![NPM](https://img.shields.io/npm/v/trezor-link.svg)](https://www.npmjs.org/package/trezor-link)
[![gitter](https://badges.gitter.im/trezor/community.svg)](https://gitter.im/trezor/community)

Library for low-level communication with Trezor.

Intended as a "building block" for other packages - it is used in ~~trezor.js~~ (deprecated) and trezor-connect.

*You probably don't want to use this package directly.* For communication with Trezor with a more high-level API, use [trezor-connect](https://github.com/trezor/connect).

## How to use

There is a runnable [example](https://github.com/trezor/trezor-link/blob/fixup-old-tests/e2e/tests/bridge.integration).

To run in simply type:
  - `yarn`
  - `yarn build:lib`
  - `./e2e/run.sh`;


## Process of moving to monorepo

Initially, this lib was typed with Flow and over the time its dependencies became outdated.
At the moment we are working on moving it into [trezor-suite monorepo](https://github.com/trezor/trezor-suite). 

Checklist: 
  
  - [x] add tests
  - [x] update dependencies (protobuf.js and others)
  - [x] use Typescript instead of Flow
  - [ ] finish review within trezor-link repo
  - [ ] move into trezor-suite only after merging to avoid messing with dependencies inside monorepo