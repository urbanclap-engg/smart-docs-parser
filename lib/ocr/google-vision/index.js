"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
var request_promise_1 = __importDefault(require("request-promise"));
var lodash_1 = __importDefault(require("lodash"));
var moment = __importStar(require("moment"));
var bluebird_1 = __importDefault(require("bluebird"));
var constants_1 = __importDefault(require("./constants"));
// Request-promise is not for image format as per the documentation
var request_1 = __importDefault(require("request"));
var request = bluebird_1.default.promisifyAll(request_1.default);
var GoogleVision = {};
// ******************************************************* //
// Logic for internal functions starts here                  //
// ******************************************************* //
var getBase64StringFromURL = function (documentUrl, ocrTimeout) { return __awaiter(void 0, void 0, void 0, function () {
    var base64Image;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, request.getAsync({
                    url: documentUrl,
                    encoding: null,
                    timeout: ocrTimeout
                })];
            case 1:
                base64Image = _a.sent();
                return [2 /*return*/, Buffer.from(lodash_1.default.get(base64Image, "body", "")).toString("base64")];
        }
    });
}); };
var getApiUrl = function (apiKey) {
    var baseURL = constants_1.default.BASE_URL;
    return lodash_1.default.join([baseURL, apiKey], constants_1.default.KEY_CONNECTOR);
};
// ******************************************************* //
// Logic for internal functions ends here                  //
// ******************************************************* //
// ******************************************************* //
// Logic for API handlers starts here                      //
// ******************************************************* //
GoogleVision.extractDocumentText = function (params) { return __awaiter(void 0, void 0, void 0, function () {
    var documentUrl, apiKey, _a, ocrTimeout, base64FetchStartTime, base64String, base64FetchEndTime, base64FetchTime, remainingOcrTime, payload, apiURL, visionResponse, annotations, fullTextAnnotation, text, err_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                documentUrl = params.document_url, apiKey = params.api_key, _a = params.timeout, ocrTimeout = _a === void 0 ? constants_1.default.OCR_TIMEOUT : _a;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 4, , 5]);
                if (lodash_1.default.isEmpty(apiKey)) {
                    return [2 /*return*/, constants_1.default.EMPTY_RESPONSE];
                }
                base64FetchStartTime = moment.utc();
                return [4 /*yield*/, getBase64StringFromURL(documentUrl, ocrTimeout)];
            case 2:
                base64String = _b.sent();
                if (lodash_1.default.isEmpty(base64String)) {
                    return [2 /*return*/, constants_1.default.EMPTY_RESPONSE];
                }
                base64FetchEndTime = moment.utc();
                base64FetchTime = moment
                    .utc(base64FetchEndTime)
                    .diff(base64FetchStartTime);
                remainingOcrTime = lodash_1.default.max([0, ocrTimeout - base64FetchTime]);
                if (!remainingOcrTime) {
                    return [2 /*return*/, constants_1.default.EMPTY_RESPONSE];
                }
                payload = constants_1.default.REQUEST_PAYLOAD;
                payload["requests"][0]["image"]["content"] = base64String;
                apiURL = getApiUrl(apiKey);
                return [4 /*yield*/, request_promise_1.default({
                        method: "POST",
                        url: apiURL,
                        body: payload,
                        json: true,
                        timeout: remainingOcrTime
                    })];
            case 3:
                visionResponse = _b.sent();
                annotations = lodash_1.default.get(visionResponse, "responses", []);
                fullTextAnnotation = lodash_1.default.find(annotations, function (annotation) {
                    var textAnnotation = lodash_1.default.get(annotation, "fullTextAnnotation", {});
                    return !lodash_1.default.isEmpty(textAnnotation);
                });
                if (lodash_1.default.isEmpty(fullTextAnnotation)) {
                    return [2 /*return*/, constants_1.default.EMPTY_RESPONSE];
                }
                text = lodash_1.default.get(fullTextAnnotation, "fullTextAnnotation.text", "");
                return [2 /*return*/, {
                        raw_text: lodash_1.default.split(text, "\n")
                    }];
            case 4:
                err_1 = _b.sent();
                throw new Error(JSON.stringify(err_1).substr(0, 200));
            case 5: return [2 /*return*/];
        }
    });
}); };
// ******************************************************* //
// Logic for API handlers ends here                        //
// ******************************************************* //
exports.default = GoogleVision;
//# sourceMappingURL=index.js.map