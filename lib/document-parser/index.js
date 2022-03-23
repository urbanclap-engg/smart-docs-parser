"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var constants_1 = __importDefault(require("../constants"));
var pan_parser_1 = __importDefault(require("./pan-parser"));
var aadhaar_parser_1 = __importDefault(require("./aadhaar-parser"));
var DocumentParser = {};
DocumentParser[constants_1.default.DOCUMENT_TYPES.PAN_CARD] = {
    parseDocumentDetails: pan_parser_1.default.parseDocumentDetails
};
DocumentParser[constants_1.default.DOCUMENT_TYPES.AADHAAR_CARD] = {
    parseDocumentDetails: aadhaar_parser_1.default.parseDocumentDetails
};
exports.default = DocumentParser;
//# sourceMappingURL=index.js.map