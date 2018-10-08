const http = require('http')

function deepMerge(...items) {
  if (!items.every(item => typeof item === 'object')) {
    return items[items.length - 1]
  }
  return items.reduce((merged, item) => {
    Object.keys(item).forEach(key => {
      merged[key] = deepMerge(merged[key], item[key])
    })
    return merged
  })
}

function readResponse(res) {
  return new Promise((resolve, reject) => {
    let buffer = ''
    res.on('data', chunk => {
      buffer += chunk
    })
    res.on('error', reject)
    res.on('end', () => resolve(buffer.toString()))
  })
}

const boundary = `----WebKitFormBoundaryABCDEFGHIJKLMNO`
const LINE_BREAK = `\r\n`

module.exports = {
  send(options, metadata) {
    return new Promise(resolve => {
      const req = http.request(
        deepMerge({
          headers: {
            'Content-Type': `multipart/form-data; boundary=${boundary}`,
          },
        }, options),
        resolve,
      )

      const formData = []
      Object.entries(metadata).forEach(([key, value]) => {
        if (Buffer.isBuffer(value)) {
          formData.push(
            [
              `--${boundary}`,
              `Content-Disposition: form-data; name="${key}"; filename="${key}"`,
              ``,
              ``,
            ].join(LINE_BREAK)
          )
          formData.push(value)
        } else {
          formData.push(
            [`--${boundary}`, `Content-Disposition: form-data; name="${key}"`, ``, `${value}`, ``].join(LINE_BREAK)
          )
        }
      })
      formData.push([``, `--${boundary}--`].join(LINE_BREAK))

      const postData = Buffer.concat(formData.map(slot =>
        Buffer.isBuffer(slot)
          ? Buffer.from(slot, 'binary')
          : Buffer.from(slot, 'utf-8')))

      req.on('error', console.error)
      req.write(postData)
      req.end()
    })
  }
}
