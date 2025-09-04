const http = require('http');
const path = require('path');
const fs = require('fs');

const publicDir = path.join(__dirname, '..', 'frontend');
const port = process.env.PORT || 8080;

const mimeTypes = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.css': 'text/css',
};

const server = http.createServer((req, res) => {
  const urlPath = req.url === '/' ? '/issuer.html' : req.url;
  const filePath = path.join(publicDir, urlPath);

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not Found');
      return;
    }
    const ext = path.extname(filePath);
    res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'text/plain' });
    res.end(content);
  });
});

server.listen(port, () => {
  console.log(`Serving frontend on http://localhost:${port}`);
  console.log('Default page: /issuer.html (use /verifier.html for verifier UI)');
});


