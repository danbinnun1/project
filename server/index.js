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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var wa_automate_1 = require("@open-wa/wa-automate");
var wa_automate_2 = require("@open-wa/wa-automate");
var console_1 = __importDefault(require("console"));
var fs = require('fs');
var express_1 = __importDefault(require("express"));
var app = (0, express_1.default)();
var g = 0;
app.get('/', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    function start(client) {
        var _this = this;
        client.onMessage(function (message) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console_1.default.log(71248512754781);
                        if (!(message.body === 'Hi')) return [3 /*break*/, 2];
                        return [4 /*yield*/, client.sendText(message.from, '👋 Hello!')];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        }); });
    }
    var a, b;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (fs.existsSync('qr_code.png')) {
                    fs.copyFileSync('qr_code.png', 'qr_code1.png');
                    fs.unlinkSync('qr_code.png');
                    res.sendFile('/home/dan/project/server/qr_code1.png');
                    return [2 /*return*/];
                }
                (0, wa_automate_1.create)({
                    sessionId: "COVID_HELPER",
                    multiDevice: true,
                    authTimeout: 60,
                    blockCrashLogs: true,
                    disableSpins: true,
                    headless: true,
                    logConsole: false,
                    popup: true,
                    qrTimeout: 0, //0 means it will wait forever for you to scan the qr code
                }).then(function (client) { return start(client); });
                a = (function () { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        return [2 /*return*/, new Promise(function (resolve, reject) {
                                var _this = this;
                                wa_automate_2.ev.on('qr.**', function (qrcode) { return __awaiter(_this, void 0, void 0, function () {
                                    var imageBuffer;
                                    return __generator(this, function (_a) {
                                        imageBuffer = Buffer.from(qrcode.replace('data:image/png;base64,', ''), 'base64');
                                        fs.writeFileSync('qr_code.png', imageBuffer);
                                        console_1.default.log(100);
                                        console_1.default.log(200);
                                        resolve(5);
                                        return [2 /*return*/];
                                    });
                                }); });
                            })];
                    });
                }); });
                console_1.default.log(1);
                return [4 /*yield*/, a()];
            case 1:
                b = _a.sent();
                console_1.default.log(b);
                console_1.default.log(2);
                return [4 /*yield*/, a()];
            case 2:
                b = _a.sent();
                console_1.default.log(b);
                console_1.default.log(3);
                return [4 /*yield*/, a()];
            case 3:
                b = _a.sent();
                console_1.default.log(b);
                console_1.default.log(4);
                return [4 /*yield*/, a()];
            case 4:
                b = _a.sent();
                console_1.default.log(b);
                res.send('Hellokasjldfhksadjlfh');
                return [2 /*return*/];
        }
    });
}); });
var port = 4000;
app.listen(5006, function () { return console_1.default.log('AKDHAKsdh'); });
