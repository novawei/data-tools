const fdfs = require('fdfs')

function slientlogger() {}
slientlogger.prototype.log = function() {}

class FdfsClient {

  constructor(host, port = 22122) {
    this.cnf = {
      trackers: [{
        host,
        port
      }],
      logger: {
        log: slientlogger
      }
    }
    // create fdfs client
    this.client = new fdfs(this.cnf)
  }

  async upload(filepath) {
    let fileId = undefined
    try {
      fileId = await this.__upload(filepath)
    } catch(error) {
      console.error(error)
    }
    return fileId
  }

  __upload(filepath) {
    return new Promise((resolve, reject) => {
      this.client.upload(filepath).then(fileId => {
        resolve(fileId)
      }).catch(error => {
        reject(error)
      })
    })
  }
}

module.exports = FdfsClient