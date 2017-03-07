![Logo][]
> Connection string smart parser

# connection-parser
[![npm][badge-npm]][npm]
[![coveralls][badge-coveralls]][coveralls]
[![deps][badge-deps]][deps]
[![travis][badge-travis]][travis]

## What is it
Simple module to convert URLs into set of parameters using default or custom rules. Useful for application which whant to provide single connection string instead of lot of parameters.

For example: `DATABASE_URL=neo4j://user:password@server.com/database?timeout=100&nocache=true node ./bin/server.js`


## Install
```
# npm install connection-parser
```

## Usage

### Parser from string template with default options:
```js
const createParser = require('connection-parser')

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
const createParser = require('connection-parser')

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

## License
Project has a MIT license so you can innovate without restrictions. Any contribuitions are welcome.


[JSON schema]: http://json-schema.org
[travis]: https://travis-ci.org/afoninsky/connection-parser
[badge-travis]: https://travis-ci.org/afoninsky/connection-parser.svg?branch=master
[coveralls]: https://coveralls.io/github/afoninsky/connection-parser?branch=master
[badge-coveralls]: https://coveralls.io/repos/github/afoninsky/connection-parser/badge.svg?branch=master
[deps]: https://david-dm.org/afoninsky/connection-parser
[badge-deps]: https://david-dm.org/afoninsky/connection-parser.svg
[npm]: https://www.npmjs.com/package/connection-parser
[badge-npm]: https://badge.fury.io/js/connection-parser.svg
[Logo]: http://i66.tinypic.com/2vv7vyx.jpg
