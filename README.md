> Connection string smart parser
>
# connection-parser
[![npm][badge-npm]][npm]
[![coveralls][badge-coveralls]][coveralls]
[![deps][badge-deps]][deps]
[![travis][badge-travis]][travis]

## What is it

## Install
```
# npm install smart-connection
```

## Usage examples

### Parser from string template with default options:
```js
const createParser = require('smart-connection')

const parser = createParser('database://user:password@localhost:12345/basename?timeout=1000&params={verbose:true}')
const options = parser('database://remote-server:333/my-base?timeout=999&params={verbose:false}')
console.log(options)
```
will output:
```
{ proto: 'database:',
  host: 'remote-server',
  port: '333',
  path: '/my-base',
  options: { timeout: '999', params: { verbose: 'false' } },
  login: 'user',
  password: 'password' }

```

### Parser described in [JSON Schema] format:
```js
const createParser = require('smart-connection')

const parser = createParser({
  type: 'object',
  properties: {
    proto: {
      type: 'string',
      minLength: 1
    },
    host: {
      type: 'string',
      default: 'localhost'
    },
    port: {
      type: 'number',
      default: 12345
    },
    path: {
      type: 'string',
      default: '/'
    },
    options: {
      type: 'object',
      properties: {
        timeout: {
          type: 'number',
          default: 1000
        }
      }
    }
  }
})
const options = parser('database://remote-server:333/my-base')
console.log(options)
```
will convert port into integer value and add default missing parameter:
```
{ proto: 'database:',
  host: 'remote-server',
  port: 333,
  path: '/my-base',
  options: { timeout: 1000 } }
```
