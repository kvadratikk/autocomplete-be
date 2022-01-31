"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const http = require("http");
const { createAutoComplete } = require('../auto-complete/index.js');
const autocomplete = createAutoComplete(require('./cities.json'));
let date;
fs.watchFile("./cities.json", () => {
    date = new Date().toUTCString();
});
http.createServer((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const startUrl = '/?complete=';
    if (req.method === "GET" && ((_a = req.url) === null || _a === void 0 ? void 0 : _a.startsWith(startUrl))) {
        if (!date) {
            date = new Date().toUTCString();
        }
        if (req.headers["if-modified-since"] !== date) {
            res.writeHead(200, {
                "Content-Type": "application/json",
                "Cache-Control": "public",
                "Last-Modified": date,
            });
        }
        else {
            res.writeHead(304, {
                "Content-Type": "application/json",
                "Cache-Control": "public",
                "Last-Modified": date,
            });
        }
        ;
        const search = req.url.slice(startUrl.length);
        res.end(JSON.stringify(yield autocomplete(search)));
    }
    else {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end("404");
    }
})).listen(process.env.PORT || 3000);
