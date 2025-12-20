const fs = require('fs')
const path = require('path')

const DATA_FILE_PATH = path.join(__dirname, '..', 'data.json')

function ensureFile() {
  if (!fs.existsSync(DATA_FILE_PATH)) {
    const initial = {
      bookings: [],
      disabledSlots: {},
      contacts: [],
      corporateRequests: [],
    }
    fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(initial, null, 2), 'utf8')
  }
}

function readData() {
  ensureFile()
  const raw = fs.readFileSync(DATA_FILE_PATH, 'utf8')
  try {
    return JSON.parse(raw)
  } catch (e) {
    console.error('Failed to parse data.json, resetting file', e)
    const reset = {
      bookings: [],
      disabledSlots: {},
      contacts: [],
      corporateRequests: [],
    }
    fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(reset, null, 2), 'utf8')
    return reset
  }
}

function writeData(data) {
  fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(data, null, 2), 'utf8')
}

module.exports = {
  readData,
  writeData,
}