const fs = require('fs')
const path = require('path')
const request = require('request')

class Fetcher {
  constructor(headers) {
    this.client = request.defaults({
      headers 
    })
  }

  async fetch(url, method = 'GET') {
    let result = undefined
    try {
      result = await this.__fetch(url, method)
    } catch(error) {
      console.error(error)
    }
    return result
  }

  __fetch(url, method) {
    return new Promise((resolve, reject) => {
      const options = {
        url,
        method
      }

      this.client(options, (error, response, body) => {
        if (error) {
          reject(error)
        } else {
          if (response.statusCode >= 200 && response.statusCode < 300) {
            resolve(body)
          } else {
            reject(new Error('status code invalid'))
          }
        }
      })
    })
  }

  async download(url, filepath, method = 'GET') {
    let result = true
    try {
      await this.__download(url, filepath, method)
    } catch(error) {
      console.error(error)
      result = false
    }
    return result
  }

  __download(url, filepath, method) {
    return new Promise((resolve, reject) => {
      const options = {
        url,
        method
      }

      let valid = false
      const rs = this.client(options, (error, response) => {
        if (error) {
          reject(error)
        } else {
          if (response.statusCode >= 200 && response.statusCode < 300) {
            valid = true
          } else {
            reject(new Error('status code invalid'))
          }
        }
      })

      // create ws and pipe
      const dirpath = path.dirname(filepath)
      if (!fs.existsSync(dirpath)) {
        fs.mkdirSync(dirpath, { recursive: true })
      } else if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath)
      }
      const ws = fs.createWriteStream(filepath)
      rs.pipe(ws)

      // ws listener
      ws.on('error', error => {
        reject(error)
      })
      ws.on('end', () => {
        if (valid) {
          resolve(filepath)
        } else {
          if (fs.existsSync(filepath)) {
            fs.unlinkSync(filepath)
          }
          reject(new Error('file not valid'))
        }
      })
    })
  }
}

module.exports = Fetcher