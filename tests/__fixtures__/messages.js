const messages = require('./messages.json');

const findInEnums = (type, enums) => {
    if (!enums) return;
    const found = enums.find(en => {
        return en.name === type;
    });
    if (found) {
        return found.values[0].name;
    }
}

const findEnumType = (type, message, messages) => {
    return findInEnums(type, message.enums) || findInEnums(type, messages.enums);
}

const findKeyValueRecursive = (data, key, value) => {
    let result = {};
    const traverse = (data, key, value) => {
        for (let k in data) {
            if (typeof data[k] !== "object" || data[k] === null) {
                continue;
            }
            if (data[k][key] === value) {
                result = data[k];
                return;
            }
            traverse(data[k], key, value);
        }
    }
    traverse(data, key, value);
    return result;
}

const findComplexType = (type, messages) => {
    return findKeyValueRecursive(messages, 'name', type)
}

const getValueForField = (field) => {
    let value;
    if (field.options && field.options.default) {
        return field.options.default;
    }
    switch (field.type) {
        case 'bool':
            value = true;
            break;
        case 'string':
            value = 'some string';
            break;
        case 'uint32':
            value = 32;
            break;
        case 'uint64': 
            value = 64;
            break;
        case 'sint32':
            value = -32;
            break;
        case 'sint64':
            value = -64;
            break;
        case 'bytes':
            value = '851fc9542342321af63ecbba7d3ece545f2a42bad01ba32cff5535b18e54b6d3106e10b6a4525993d185a1443d9a125186960e028eabfdd8d76cf70a3a7e3100';
            break;
    }
    return value;

}
const buildParams = (message) => {
    const params = {};
    // then it is nested enum
    if (message.values) {
        return message.values[0].name
    }
    message.fields.forEach(field => {
        let value = getValueForField(field); 
        let en;
        if (!value) {
            const complex = findComplexType(field.type, messages);
            if (complex) {
                value = buildParams(complex)
            }
            en = findEnumType(field.type, message, messages);
            if (en) {
                value = en;
            }
        }
        if (value) {
            if (field.rule === 'repeated') {
                if (en) {
                    // crazy crazy crazy. encoding enum as number generaly works
                    // but behaviour of decoding differs wheter it is in array or not. 
                    // if in array it would decode to number
                    // if not in array it would decode to string label like Bitcoin_Capability
                    return params[field.name] = [1];
                }
                return params[field.name] = [ value ];
            }
            return params[field.name] = value ;
        }
        
        console.log('unhandled field type ', field.type);
    })
    return params;
}

const buildFixtures = (messages) => {
    const fixtures = [];

    
    // I only want to test messages that are really parsed by trezor-link, which are messages listed under
    // messages.json.enums[1] (name="MessageType").
    const messageTypeEnum = messages.enums.find(en => en.name === 'MessageType').values;
    const messageNames = messageTypeEnum.map(m => {
        return m.name.substr(m.name.lastIndexOf('_')+ 1);
    })

    messages.messages
        .filter(m => messageNames.includes(m.name))
        .forEach(message => {
            if (!message.name) {
                return;
            }
            
            let fixture = {
                name: message.name,
                description: message.name,
                params: {}
            }

            if (!message.fields) {
                return fixtures.push(fixture);
            }
            try {
                const params = buildParams(message)
            
                fixtures.push({
                    name: message.name,
                    params,
                })

            } catch (err) {
                console.log(err);
                return
            }
    });

    return fixtures;
}

const fixtures = buildFixtures(messages);

module.exports = fixtures;