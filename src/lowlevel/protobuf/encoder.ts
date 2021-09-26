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
        patched[key] = value.map((v) => transform(field.type, v));
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
  const payload = patch(Message, data);

  // Verify the payload if necessary (i.e. when possibly incomplete or invalid)
  const errMsg = Message.verify(payload);
  if (errMsg) {
    // throw Error(errMsg);
  }

  // Create a new message
  const message = Message.fromObject(payload);
  // , {
  //   enums: String, // enums as string names
  //   bytes: String, // bytes as base64 encoded strings
  //   defaults: false, // includes default values
  //   arrays: true, // populates empty arrays (repeated fields) even if defaults=false
  //   objects: true, // populates empty objects (map fields) even if defaults=false
  //   oneofs: true, // includes virtual oneof fields set to the present field's name
  // });

  // Encode a message to an Uint8Array (browser) or Buffer (node)
  const buffer = Message.encode(message).finish();

  return buffer;
};
