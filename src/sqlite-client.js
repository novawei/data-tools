const sqlite3 = require('sqlite3').verbose()

class SqliteClient {
  constructor(dbpath) {
    this.db = new sqlite3.Database(dbpath)
  }

  close() {
    this.db.close()
  }

  async run(sql) {
    let result = true
    try {
      await this.__run(sql)
    } catch(error) {
      console.error(error)
      result = false
    }
    return result
  }

  __run(sql) {
    return new Promise((resolve, reject) => {
      this.db.run(sql, error => {
        if (error) {
          reject(error)
        } else {
          resolve()
        }
      })
    })
  }

  async all(sql) {
    let results = undefined
    try {
      results = await this.__all(sql)
    } catch(error) {
      console.error(error)
    }
    return results
  }

  __all(sql) {
    return new Promise((resolve, reject) => {
      this.db.all(sql, (error, results) => {
        if (error) {
          reject(error)
        } else {
          resolve(results)
        }
      })
    })
  }
}

module.exports = SqliteClient