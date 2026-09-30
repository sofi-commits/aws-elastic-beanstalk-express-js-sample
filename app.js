const express = require('express');
const app = express();

app.get('/', (req, res) => res.send('Hello World!'));

module.exports = app;

// Only start listening when this file is run directly (node app.js),
// not when it's imported by a test file. This is what makes the app
// testable without changing how it actually runs in production.
if (require.main === module) {
  const port = process.env.PORT || 8080;
  app.listen(port);
  console.log(`App running on http://localhost:${port}`);
}
