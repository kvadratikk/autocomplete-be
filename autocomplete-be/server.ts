import fs = require('fs');
import http = require('http');

const { createAutoComplete } = require('../auto-complete/index.js');
const autocomplete = createAutoComplete(require('./cities.json'));

let date: string;

fs.watchFile("./cities.json", () => {
  date = new Date().toUTCString();
});

http.createServer(async (req, res) => {
  const startUrl = '/?complete=';

  if (req.method === "GET" && req.url?.startsWith(startUrl)) {
    if (!date) {
      date = new Date().toUTCString();
    }

    if (req.headers["if-modified-since"] !== date) {
      res.writeHead(200, {
        "Content-Type": "application/json",
        "Cache-Control": "public",
        "Last-Modified": date,
      });
    } else {
      res.writeHead(304, {
        "Content-Type": "application/json",
        "Cache-Control": "public",
        "Last-Modified": date,
      });
    };

    const search = req.url.slice(startUrl.length);
    res.end(JSON.stringify(await autocomplete(search)));
  } else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end("404");
  }
}).listen(process.env.PORT || 3000);