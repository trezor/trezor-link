/**
 * this does the same thing like legacy monkey_patch. just not by monkey_patching
 */

export const _patch = (Message, payload = {}) => {
  const patched = {};
  Object.keys(Message.fields).forEach(key => {
    if (Message.fields[key].type === 'bytes') {
      patched[key] = Buffer.from(payload[key], `hex`);
    } else {
      patched[key] = payload[key];
    }

  })
  return patched;
}

const primitiveTypes = [
  'string', 'boolean', 'uint32', 'uint64', 'sint32', 'sint64', 'bool', 'bytes',
]

const transformationMap = {
  bool: 'bytes',
};

const transform = (fieldType, value) => {
  
  if (fieldType === 'bytes') {
    return Buffer.from(value, `hex`);
  }
  return value;
}

/*
  Legacy outbound middleware
*/
export function patch(Message, payload = {}) {
  const patched = {};

  if (!Message) return payload;

  for (const key in Message.fields) {
    const field = Message.fields[key];
    const value = payload[key];

    if (!value) continue;
    if (primitiveTypes.includes(field.type)) {
      if (field.repeated) {
        patched[key] = value.map((v, i) => transform(field.type, value[i]));
      } else {
        patched[key] = transform(field.type, value);
      }
      continue;
    }

    else if (field.repeated) {
      patched[key] = payload[key].map(i => {
        const RefMessage = Message.lookup(field.type);
        return patch(RefMessage, i)
      });
    }
    else if (typeof value === 'object') {
      const RefMessage = Message.lookupType(field.type);
      patched[key] = patch(RefMessage, value);
    }
    // enum
    else if (typeof value !== 'object' && !primitiveTypes.includes(field.type)) {
      const RefMessage = Message.lookup(Message.fields[key].type);
      patched[key] = RefMessage.values[value];
    }
    else {
      patched[key] = value;
    }
  }
  return patched
}

// ok

// const primitiveTypes = [
//   'string', 'boolean', 'uint32', 'uint64', 'sint32', 'sint64', 'bool', 'bytes',
// ]
// /*
//   Legacy outbound middleware
// */
// export function patch(Message, payload = {}) {
//   const patched = {};
//   if (Message.name === 'BinanceTransferMsg') {
//     debugger
//   }
//   for (const key in Message.fields) {

//     const value = payload[key];

//     // ??
//     if (!value) continue;

//     console.log(key, Message.fields[key].type)
//     if (Message.fields[key].type === 'bytes') {
//       console.log('key changing buffer', key);
//       patched[key] = Buffer.from(value, `hex`);
//     }

//     // else if (value instanceof Buffer) {
//     //   console.log('xxxx', key, value);
//     //   patched[key] = value.toString('hex');
//     // }
//     // else if (key === 'node' && Message.fields['node'].resolvedType && Message.fields['node'].resolvedType.fields) {
//     else if (Array.isArray(value)) {
//       if (Message.name === 'BinanceTransferMsg') {
//         debugger
//       }
//       const decodedArr = value.map((i) => {
//         // was not handled, for example MultisigRedeemScriptType has this:
//         //   {
//         //     "rule": "repeated",
//         //     "options": {},
//         //     "type": "bytes",
//         //     "name": "signatures",
//         //     "id": 2
//         // },
//         // interesting is that connect sends it as string[] ??
//         if (i instanceof Buffer) {
//           return Buffer.from(i, 'hex')
//         }
//         if (typeof i === 'object') {
//           return patch(Message, i);
//         } else {
//           return i;
//         }


//       });
//       patched[key] = decodedArr;
//       if (Message.name === 'BinanceTransferMsg') {
//         debugger
//       }
//     }
//     else if (typeof value === 'object') {
//       const RefMessage = Message.lookupType(Message.fields[key].type);
//       patched[key] = patch(RefMessage, value);
//     }
//     // enum
//     else if (typeof value !== 'object' && !primitiveTypes.includes(Message.fields[key].type)) {
//       if (Message.name === 'BinanceTransferMsg') {
//         debugger
//       }
//       const RefMessage = Message.lookup(Message.fields[key].type);

//       patched[key] = RefMessage.values[value];
//     }
//     else {
//       patched[key] = value;
//     }
//   }
//   if (Message.name === 'BinanceTransferMsg') {
//     debugger
//   }

//   return patched
// }

