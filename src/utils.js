const path = require('path')
const mime = require('mime')
const disposition = require('content-disposition')

/**
 * parse response header fields 'Content-Type' and 'Content-Disposition'
 * return filename and extension
 * 
 * @param {*} response 
 */
function parseFileInfo(response) {
  let filename = undefined
  let extension = undefined
  //'https://www.charlesproxy.com/assets/release/4.2.8/charles-proxy-4.2.8-win64.msi'
  const contentDisposition = response.headers['content-disposition']
  if (contentDisposition) {
    const result = disposition.parse(contentDisposition)
    if (result && result.parameters && result.parameters.filename) {
      filename = result.parameters.filename
    }
  }
  if (!filename) {
    filename = path.basename(response.request.uri.href)
  }

  const contentType = response.headers['content-type']
  if (contentType) {
    extension = mime.getExtension(contentType)
  }
  
  return {
    filename,
    extension
  }
}

/**
 * resolve filepath with fileinfo(parsed from response headers)
 * fix filename and extension with fileinfo
 * 
 * @param {*} filepath 
 * @param {*} fileinfo 
 */
function resolveFilePath(filepath, response) {
  const fileinfo = parseFileInfo(response)
  let resolvedPath = filepath
  const dirname = path.dirname(filepath)
  if (fileinfo) {
    if (fileinfo.filename) {
      const ext = path.extname(fileinfo.filename)
      if (!ext && fileinfo.extension) {
        resolvedPath = path.resolve(dirname, `${fileinfo.filename}.${fileinfo.extension}`)
      } else {
        resolvedPath = path.resolve(dirname, fileinfo.filename)
      }
    } else if (fileinfo.extension) {
      const ext = path.extname(filepath)
      if (!ext) {
        const filename = path.basename(filepath)
        resolvedPath = path.resolve(dirname, `${filename}.${fileinfo.extension}`)
      }
    }
  }
  return resolvedPath
}

/**
 * resolve file extension only
 */
function resolveFileExt(filepath, response) {
  const fileinfo = parseFileInfo(response)
  let resolvedPath = filepath
  const dirname = path.dirname(filepath)
  if (fileinfo && fileinfo.extension) {
    const ext = path.extname(filepath)
    if (!ext) {
      const filename = path.basename(filepath)
      resolvedPath = path.resolve(dirname, `${filename}.${fileinfo.extension}`)
    }
  }
  return resolvedPath
}

module.exports = {
  parseFileInfo,
  resolveFilePath,
  resolveFileExt
}