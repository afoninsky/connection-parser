const { test } = require('ava')
const createParser = require(process.env.PWD)

test('parse from url', t => {
  const parser = createParser('test://user:password@host:12345/path?field1=true&field2=true&nestedField={some:object}')
  const expectResult = {
    proto: 'test:',
    host: 'localhost',
    options: {
      field1: 'rewritten',
      nestedField: { some: 'other' },
      field2: 'true'
    },
    port: '12345',
    path: '/path',
    login: 'user',
    password: 'password'
  }
  const result = parser('test://localhost?nosuchoption=true&field1=rewritten&nestedField={some:other}')
  t.deepEqual(result, expectResult)
})

test('parse from json schema', t => {
  const jsonSchema = {
    type: 'object',
    properties: {
      login: {
        type: 'string'
      },
      host: {
        type: 'string'
      },
      port: {
        type: 'number',
        default: 1000
      }
    }
  }
  const parser = createParser(jsonSchema)

  const expectResult = { host: 'localhost', port: 1000 }
  const result = parser('test://localhost?nosuchoption=true&field1=rewritten&nestedField={some:other}')
  t.deepEqual(result, expectResult)
})

test('error - invalid schema', t => {
  t.throws(() => createParser({}), 'please pass json schema (http://json-schema.org) or valid URI')
})

test('error - invalid url', t => {
  const parser = createParser('test://localhost')
  t.throws(() => parser('mongodb://localhost'), /data.proto should match pattern/)
})
