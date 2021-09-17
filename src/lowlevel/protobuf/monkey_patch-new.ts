/**
 * this does the same thing like legacy monkey_patch. just not by monkey_patching
 */

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
    if (typeof value === 'undefined') {
      continue;
      // patched[key] = null;
      // ?
      // continue;
      console.log('00000000000000000000000 key no value', key);
    } 
    else if (primitiveTypes.includes(field.type)) {
      if (field.repeated) {
        patched[key] = value.map((v, i) => transform(field.type, value[i]));
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
      console.log(5);
      patched[key] = value;
    }
  }
  return patched;
}
