# data-tools
tools with async/await wrap, simply use for writing sync script


## fdfs-client
```javascript
const { FdfsClient } = require('@novawei/data-tools')

async function fdfsExample() {
  const client = new FdfsClient('127.0.0.1')
  const fileId = await client.upload('C:\\test.jpg')
  console.log(fileId)
}
```

## mysql-client

### run
```javascript
const { MySqlClient } = require('@novawei/data-tools')

async function mysqlExample() {
  const client = new MySqlClient('127.0.0.1', 'root', '123456', 'myapp')
  let results = await client.run('SELECT * FROM `t_user` LIMIT ?, 10', [1])
  console.log(results)
}
```

### exec
```javascript
const { MySqlClient } = require('@novawei/data-tools')

async function mysqlExample() {
  const client = new MySqlClient('127.0.0.1', 'root', '123456', 'myapp')
  const conn = client.getConnection()
  for (let i = 0; i < 10; i++) {
    let results = await client.run('INSERT INTO `t_user` VALUES(?, ?)', [i, `user_${i}`])
    console.log(results)
  }
  client.endConnection(conn)
}
```

## sleep
```javascript
const { sleep } = require('@novawei/data-tools')

async function sleepExample() {
  console.log('hello')
  await sleep(1000) // ms
  console.log('world')
}
```

## sqlite-client
```javascript
const { SqliteClient } = require('@novawei/data-tools')

async function sqliteExample() {
  const client = new SqliteClient('/path/to/sqlite.db')
  const results = await client.all('SELECT * FROM t_user LIMIT 0, 10')
  console.log(results) // [{}]
  client.close()
}
```

## xlsx

### read
```javascript
const { xlsx } = require('@novawei/data-tools')

async function xlsxExample() {
  const results = await xlsx.read('/path/to/xlsx/file')
  console.log(results) // [[], []]
}
```

### write
```javascript
const { xlsx } = require('@novawei/data-tools')

async function xlsxExample() {
  const cols = [
    {
      caption: 'id',
      type: 'string'
    },
    {
      caption: 'name',
      type: 'string'
    },
  ]
  const rows = [
    ['1', 'user1'],
    ['2', 'user2']
  ]
  const result = await xlsx.write('/path/to/xlsx/output/file', cols, rows)
  console.log(result) // true or false
}
```

## fetcher

### normal request
```javascript
const { Fetcher } = require('@novawei/data-tools')

async function fetcherExample() {
  const fetcher = new Fetcher({
    'User-Agent': 'Mozilla/5.0 (iPhone; U; CPU like Mac OS X; en) AppleWebKit/420+ (KHTML, like Gecko) Version/3.0 Mobile/1C28 Safari/419.3'
  })

  const result = fetcher.fetch('http://url')
  console.log(result) // response body
}
```

### download file
```javascript
const { Fetcher } = require('@novawei/data-tools')

async function fetcherExample() {
  const fetcher = new Fetcher({
    'User-Agent': 'Mozilla/5.0 (iPhone; U; CPU like Mac OS X; en) AppleWebKit/420+ (KHTML, like Gecko) Version/3.0 Mobile/1C28 Safari/419.3'
  })

  const result = fetcher.download('http://url', '/path/to/save/file')
  console.log(result) // true or false 
}
```