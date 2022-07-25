const fs = require('fs');
const https = require('https');
const path = require('path');

const schemaUrl = new URL('package.json', 'https://json.schemastore.org');
const destination = path.resolve(__dirname, '../schema.json');

https.get(schemaUrl, function (res) {
  res.pipe(fs.createWriteStream(destination));
});
