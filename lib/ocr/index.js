"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var google_vision_1 = __importDefault(require("./google-vision"));
var constants_1 = __importDefault(require("../constants"));
var OCR = {};
OCR[constants_1.default.OCR_AGENTS.GOOGLE_VISION] = {
    extractDocumentText: google_vision_1.default.extractDocumentText
};
exports.default = OCR;
//# sourceMappingURL=index.js.map