const fs = require('fs')
const reader = require('xlsx-extractor')
const writer = require('excel-export')

function __readXlsx(filepath, sheet, offset) {
  return new Promise((resolve, reject) => {
    reader.extract(filepath, sheet).then(sheet => {
      const results = sheet.cells.slice(offset)
      resolve(results)
    }).catch(error => {
      reject(error)
    })
  })
}

async function read(filepath, sheet = 1, offset = 0) {
  let results = undefined
  try {
    results = await __readXlsx(filepath, sheet, offset)
  } catch(error) {
    console.error(error)
  }
  return results
}

function __writeXlsx(filepath, cols, rows) {
  return new Promise((resolve, reject) => {
    const result = writer.execute({
      cols,
      rows
    })
    if (result) {
      if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath)
      }
      fs.writeFileSync(filepath, result, 'binary', (error) => {
        if (error) {
          reject(error)
        } else {
          resolve(filepath)
        }
      })
    } else {
      reject(new Error('excel export failed'))
    }
  })
}

async function write(filepath, cols, rows) {
  let result = true
  try {
    await __writeXlsx(filepath, cols, rows)
  } catch(error) {
    console.error(error)
    result = false
  }
  return result
}

module.exports = {
  read,
  write
}