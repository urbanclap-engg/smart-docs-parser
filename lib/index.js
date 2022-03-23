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
var lodash_1 = __importDefault(require("lodash"));
var ocr_1 = __importDefault(require("./ocr"));
var document_parser_1 = __importDefault(require("./document-parser"));
var constants_1 = __importDefault(require("./constants"));
var config_1 = __importDefault(require("config"));
var SmartDocuments = {};
// ******************************************************* //
// Logic for internal functions starts here                //
// ******************************************************* //
var getAPIKeyFromConfig = function (ocrLibrary) {
    if (config_1.default.has("smart-docs-parser.api_keys")) {
        var apiKeys = config_1.default.get("smart-docs-parser.api_keys");
        return lodash_1.default.get(apiKeys, "" + ocrLibrary, "");
    }
    return "";
};
var extractRawText = function (documentURL, ocrLibrary, customOCR, ocrTimeout) { return __awaiter(void 0, void 0, void 0, function () {
    var apiKey;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                apiKey = getAPIKeyFromConfig(ocrLibrary);
                if (!!lodash_1.default.isEmpty(customOCR)) return [3 /*break*/, 2];
                return [4 /*yield*/, customOCR.extractDocumentText({
                        document_url: documentURL,
                        api_key: apiKey,
                        timeout: ocrTimeout
                    })];
            case 1: return [2 /*return*/, _a.sent()];
            case 2: return [4 /*yield*/, ocr_1.default[ocrLibrary].extractDocumentText({
                    document_url: documentURL,
                    api_key: apiKey,
                    timeout: ocrTimeout
                })];
            case 3: return [2 /*return*/, _a.sent()];
        }
    });
}); };
var validateDocumentText = function (rawText) {
    var numberOfLines = lodash_1.default.size(rawText);
    if (!numberOfLines || numberOfLines > constants_1.default.MAX_LINES) {
        return false;
    }
    return true;
};
var parseDocumentDetails = function (documentType, rawText, customParser) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!!lodash_1.default.isEmpty(customParser)) return [3 /*break*/, 2];
                return [4 /*yield*/, customParser.parseDocumentDetails({
                        raw_text: rawText
                    })];
            case 1: return [2 /*return*/, _a.sent()];
            case 2: return [4 /*yield*/, document_parser_1.default[documentType].parseDocumentDetails({
                    raw_text: rawText
                })];
            case 3: return [2 /*return*/, _a.sent()];
        }
    });
}); };
// ******************************************************* //
// Logic for internal functions ends here                  //
// ******************************************************* //
// ******************************************************* //
// Logic for API handlers starts here                      //
// ******************************************************* //
SmartDocuments.extractDocumentDetailsFromImage = function (params) { return __awaiter(void 0, void 0, void 0, function () {
    var documentType, documentURL, ocrLibrary, customParser, customOCR, ocrTimeout, ocrResponse, rawText, isValidText, documentDetails;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                documentType = params.document_type, documentURL = params.document_url, ocrLibrary = params.ocr_library, customParser = params.custom_parser, customOCR = params.custom_ocr, ocrTimeout = params.timeout;
                return [4 /*yield*/, extractRawText(documentURL, ocrLibrary, customOCR, ocrTimeout)];
            case 1:
                ocrResponse = _a.sent();
                rawText = lodash_1.default.get(ocrResponse, "raw_text", []);
                isValidText = validateDocumentText(rawText);
                if (!isValidText) {
                    return [2 /*return*/, constants_1.default.EMPTY_RESPONSE];
                }
                return [4 /*yield*/, parseDocumentDetails(documentType, rawText, customParser)];
            case 2:
                documentDetails = _a.sent();
                return [2 /*return*/, {
                        raw_text: rawText,
                        is_document_valid: lodash_1.default.get(documentDetails, "is_document_valid"),
                        document_details: lodash_1.default.get(documentDetails, "document_details")
                    }];
        }
    });
}); };
// ******************************************************* //
// Logic for API handlers ends here                        //
// ******************************************************* //
exports.default = SmartDocuments;
//# sourceMappingURL=index.js.map