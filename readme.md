# Simple Form Data

It's a toy project, implemented less and not well-tested functions than the famous [form-data](https://www.npmjs.com/package/form-data) lib. **Do NOT use this in your production env!** (Well actually I don't think anyone would like to use it.)

# Usage Example

Let's install it from npm.
```
npm install simple-form-data --save
```

Then in Node.js.

```js
const SimpleFormData = require('simple-form-data')
SimpleFormData
  .send(
    // First argument is about HTTP headers of your request, in the shape of http.RequestOptions.
    // This lib could deep-merge these options with its preset options
    {
      method: 'post',
      host: 'localhost',
      port: 80,
      path: '/',
      headers: {
        // extra headers here
      },
    },
    // Second argument is about the form data content,
    // pass a object whose values are either string or Buffer.
    {
      stringKey: "stringValue",
      fileKey: fs.createReadStream() // Buffer
    },
  )
  // Then it returns a promise
  .then(response => {
    // it's an instance of HTTP response from the 'http' module
  })
```
