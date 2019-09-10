const fs = require('fs')
const path = require('path')
const request = require('request')
const uuid = require('uuid')
const { resolveFilePath, resolveFileExt } = require('./utils')

class Fetcher {
  constructor(headers) {
    this.client = request.defaults({
      // default enable cookie storage
      jar: true, 
      // default enable gzip encoding, this will add 'Accept-Encoding': 'gzip' to headers
      gzip: true,
      // default headers, for example: custom user-agent to fake app request
      headers,
    })
  }

  async fetch(url, method = 'GET', config= {}) {
    let result = undefined
    try {
      result = await this.__fetch(url, method, config)
    } catch(error) {
      console.error(error)
    }
    return result
  }

  __fetch(url, method, config) {
    return new Promise((resolve, reject) => {
      const options = {
        url,
        method,
        ...config
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

  async download(url, filename = undefined, dirpath = './download', method = 'GET', config = { resolveFileExt, resolveFilePath }) {
    let result = true
    try {
      await this.__download(url, filename, dirpath, method, config)
    } catch(error) {
      console.error(error)
      result = false
    }
    return result
  }

  __download(url, filename, dirpath, method, config) {
    return new Promise((resolve, reject) => {
      const options = {
        url,
        method,
        ...config
      }

      let valid = false
      let validResponse = undefined
      const rs = this.client(options, (error, response) => {
        if (error) {
          reject(error)
        } else {
          if (response.statusCode >= 200 && response.statusCode < 300) {
            valid = true
            validResponse = response
          } else {
            reject(new Error('status code invalid'))
          }
        }
      })

      // create random filename, will resolve after download by resolveFilepath function
      let filepath = undefined
      if (filename) {
        filepath = path.resolve(dirpath, filename)
      } else {
        filepath = path.resolve(dirpath, uuid.v1())
      }

      // create ws and pipe
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
      ws.on('finish', () => {
        if (valid) {
          if (!filename) {
            let resolveFilePath = undefined
            if (config && config.resolveFilePath) {
              resolveFilePath = config.resolveFilePath
            }
            if (resolveFilePath) {
              const newpath = resolveFilePath(filepath, validResponse)
              if (newpath && newpath != filepath) {
                fs.renameSync(filepath, newpath)
                filepath = newpath
              }
            }
          } else {
            let resolveFileExt = undefined
            if (config && config.resolveFileExt) {
              resolveFileExt = config.resolveFileExt
            }
            if (resolveFileExt) {
              const newpath = resolveFileExt(filepath, validResponse)
              if (newpath && newpath != filepath) {
                fs.renameSync(filepath, newpath)
                filepath = newpath
              }
            }
          }
          validResponse = undefined // clear memory
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