const assert = require('assert');
const http = require('http');
const app = require('../app');

const server = app.listen(0, () => {
  const port = server.address().port;
  http.get(`http://localhost:${port}/`, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      assert.strictEqual(res.statusCode, 200, 'Expected HTTP 200');
      assert.strictEqual(data, 'Hello World!', 'Expected the Hello World greeting');
      console.log('Test passed: GET / returns 200 and the correct greeting');
      server.close();
      process.exitCode = 0;
    });
  }).on('error', (err) => {
    console.error('Test failed:', err);
    server.close();
    process.exitCode = 1;
  });
});
