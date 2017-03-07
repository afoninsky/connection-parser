const url = require('url')
const Ajv = require('ajv')

// iterate over object and convert string representation into object
const parseNestedObjects = obj => {
  for (let key in obj) {
    const value = obj[key]
    if (value[0] === '{' && value[value.length - 1] === '}') {
      obj[key] = value.substring(1, value.length - 1).split(',').reduce((acc, item) => {
        const [ k, v ] = item.split(':')
        acc[k] = v
        return acc
      }, {})
    }
  }
  return obj
}

// extract configuration fields from url template
const dataFromUrl = uri => {
  const data = url.parse(uri, true)

  const fields = {
    proto: data.protocol,
    host: data.hostname,
    port: data.port,
    path: data.pathname,
    options: parseNestedObjects(data.query)
  }

  const [ login, password ] = (data.auth || '').split(':')
  if (login) { fields.login = login }
  if (password) { fields.password = password }

  return fields
}

const schemaPropertiesRecursive = input => {

  if (typeof input === 'string') {
    return {
      type: 'string',
      default: input
    }
  }

  const obj = {
    type: 'object',
    properties: {}
  }
  for (let key in input) {
    obj.properties[key] = schemaPropertiesRecursive(input[key])
  }
  return obj
}

// return ready schema OR create schema from URI
const schemaFromString = text => {

  // schema already passed
  if (typeof text === 'object') {
    if (!text.properties || text.type !== 'object') {
      throw new Error('please pass json schema (http://json-schema.org) or valid URI')
    }
    return text
  }

  // extract object from url and create schema from it
  const data = dataFromUrl(text)
  const schema = schemaPropertiesRecursive(data)
  Object.assign(schema.properties.proto, {
    pattern: `^${data.proto}$` // http:
  })
  schema.requred = ['proto', 'host', 'path']
  return schema
}

module.exports = input => {
  const ajv = new Ajv({
    useDefaults: true,
    coerceTypes: true,
    removeAdditional: 'all'
  })

  const schema = schemaFromString(input)
  const validator = ajv.compile(schema)

  return uri => {
    const data = dataFromUrl(uri)

    // remove nulls so schema can add own defaults
    for (let key in data) {
      if (data[key] === null) {
        delete data[key]
      }
    }

    // check arguments against schema
    if (!validator(data)) {
      throw new Error(`${ajv.errorsText(validator.errors)}: ${uri}`)
    }

    return data
  }
}
