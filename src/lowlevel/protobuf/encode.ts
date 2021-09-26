import { Type } from "protobufjs";

import { isPrimitiveField } from "../../utils/protobuf";

const transform = (fieldType: string, value: any) => {
  if (fieldType === "bytes") {
    // special edge case
    // for example MultisigRedeemScriptType might have field signatures ['', '', ''] (check in TrezorConnect signTransactionMultisig test fixtures).
    // trezor needs to receive such field as signatures: [b'', b'', b'']. If we transfer this to empty buffer with protobufjs, this will be decoded by
    // trezor as signatures: [] (empty array)
    if (typeof value === "string" && !value) return value;

    // normal flow
    return Buffer.from(value, `hex`);
  }
  return value;
};

export function patch(Message: Type, payload: any) {
  const patched = {};

  for (const key in Message.fields) {
    const field = Message.fields[key];
    const value = payload[key];

    // no value for this field
    // todo: what about null?
    if (typeof value === "undefined") {
      continue;
    }
    // primitive type
    else if (isPrimitiveField(field.type)) {
      if (field.repeated) {
        patched[key] = value.map((v: any) => transform(field.type, v));
      } else {
        patched[key] = transform(field.type, value);
      }
      continue;
    }
    // repeated
    else if (field.repeated) {
      const RefMessage = Message.lookupTypeOrEnum(field.type);
      patched[key] = value.map((v: any) => patch(RefMessage, v));
    }
    // message type
    else if (typeof value === "object" && value !== null) {
      const RefMessage = Message.lookupType(field.type);
      patched[key] = patch(RefMessage, value);
    }
    // enum type
    else if (typeof value === "number") {
      const RefMessage = Message.lookupEnum(field.type);
      patched[key] = RefMessage.values[value];
    } else {
      patched[key] = value;
    }
  }
  return patched;
}

export const encode = (Message: Type, data: Object) => {
  const payload = patch(Message, data);

  const message = Message.fromObject(payload);

  // Encode a message to an Uint8Array (browser) or Buffer (node)
  const buffer = Message.encode(message).finish();

  return buffer;
};
