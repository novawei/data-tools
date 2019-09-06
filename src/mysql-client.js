const mysqldb = require('mysql')

class MySqlClient {

  constructor(host, user, password, database, port = 3306, charset = 'utf8mb4') {
    this.cnf = {
      host,
      user,
      password,
      database,
      port,
      charset
    }
  }

  getConnection(autoConnect = true) {
    const conn = mysqldb.createConnection(this.cnf)
    if (autoConnect) {
      conn.connect()
    }
    return conn
  }

  endConnection(conn) {
    if (conn) {
      conn.end()
    }
  }

  async run(sql, values) {
    const conn = this.getConnection()
    let results = await this.exec(conn, sql, values) 
    this.endConnection(conn)
    return results
  }

  async exec(conn, sql, values) {
    let results = undefined
    try {
      results = await this.__exec(conn, sql, values)
    } catch(error) {
      console.error(error)
    }
    return results
  }

  __exec(conn, sql, values) {
    return new Promise((resolve, reject) => {
      conn.query(sql, values, (error, results, fields) => {
        if (error) {
          reject(error)
        } else {
          resolve(results)
        }
      })
    })
  }

}

module.exports = MySqlClient