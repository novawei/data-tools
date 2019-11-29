const MySqlClient = require('./src/mysql-client')
const SqliteClient = require('./src/sqlite-client')
const FdfsClient = require('./src/fdfs-client')
const Fetcher = require('./src/fetcher')
const sleep = require('./src/sleep')
const xlsx = require('./src/xlsx')

module.exports = {
  MySqlClient,
  SqliteClient,
  FdfsClient,
  Fetcher,
  sleep,
  xlsx
}

async function test() {
  const fetcher = new Fetcher()
  await fetcher.download('https://www.cloud-learn.com/group1/M00/00/C3/rB-YnV0CBECAa4VyAAEFvIqCAis023.png')
  console.log('hhh')
}

// test()