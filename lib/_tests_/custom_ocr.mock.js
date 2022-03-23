"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Mock for test
// ******************************************************* //
// Logic for API handlers starts here                      //
// ******************************************************* //
var extractDocumentText = function (_a) {
    var documentURL = _a.document_url;
    return {
        raw_text: [documentURL]
    };
};
// ******************************************************* //
// Logic for API handlers ends here                        //
// ******************************************************* //
exports.default = { extractDocumentText: extractDocumentText };
//# sourceMappingURL=custom_ocr.mock.js.map