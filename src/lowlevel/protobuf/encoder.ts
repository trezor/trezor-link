/**
 * this does the same thing like legacy monkey_patch. just not by monkey_patching
 */

import { Type } from "protobufjs";

const primitiveTypes = [
  "string",
  "boolean",
  "uint32",
  "uint64",
  "sint32",
  "sint64",
  "bool",
  "bytes",
];

const transform = (fieldType: string, value: any) => {
  if (fieldType === "bytes") {
    // message with single bytes field when empty (Initialize)
    if (!value) return null;

    return Buffer.from(value, `hex`);
  }
  return value;
};

/*
  Legacy outbound middleware
*/
export function patch(Message: any, payload = {}) {
  const patched = {};
  if (!Message) return payload;

  for (const key in Message.fields) {
    const field = Message.fields[key];
    const value = payload[key];
    if (typeof value === "undefined") {
      continue;
    } else if (primitiveTypes.includes(field.type)) {
      if (field.repeated) {
        patched[key] = value.map((v) => {
          // weird: signatures ['', '', ''];
          if (!v) return v;
          // normal
          return transform(field.type, v);
        });
      } else {
        patched[key] = transform(field.type, value);
      }
      continue;
    } else if (field.repeated) {
      patched[key] = payload[key].map((i) => {
        const RefMessage = Message.lookup(field.type);
        return patch(RefMessage, i);
      });
    } else if (typeof value === "object") {
      const RefMessage = Message.lookupType(field.type);
      patched[key] = patch(RefMessage, value);
    }
    // enum
    else if (
      typeof value !== "object" &&
      !primitiveTypes.includes(field.type)
    ) {
      const RefMessage = Message.lookup(Message.fields[key].type);
      patched[key] = RefMessage.values[value];
    } else {
      patched[key] = value;
    }
  }
  return patched;
}

export const encode = (Message: Type, data: Object) => {
  // console.log("raw", data);
  const payload = patch(Message, data);
  // console.log("patched", payload);
  // console.log("patched payload", JSON.stringify(payload, null, 2));
  // Verify the payload if necessary (i.e. when possibly incomplete or invalid)
  const errMsg = Message.verify(payload);
  if (errMsg) {
    // throw Error(errMsg);
  }

  const message = Message.fromObject(payload);

  // Encode a message to an Uint8Array (browser) or Buffer (node)
  const buffer = Message.encode(message).finish();

  return buffer;
};
