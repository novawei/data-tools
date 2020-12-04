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

  async remove(filepath) {
    const index = filepath.indexOf('group')
    if (index > 0) {
      filepath = filepath.substring(index)
    }
    try {
      await this.__remove(filepath)
    } catch(error) {
      console.error(error)
    }
  }

  __remove(filepath) {
    return new Promise((resolve, reject) => {
      this.client.del(filepath).then(() => {
        resolve()
      }).catch(err => {
        reject(err)
      })
    })
  }
}

module.exports = FdfsClient