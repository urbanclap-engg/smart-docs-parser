"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Constants = {};
Constants.BASE_URL = "https://vision.googleapis.com/v1/images:annotate";
Constants.KEY_CONNECTOR = "?key=";
Constants.REQUEST_PAYLOAD = {
    requests: [
        {
            image: {
                content: ""
            },
            features: [
                {
                    type: "TEXT_DETECTION"
                }
            ]
        }
    ]
};
Constants.EMPTY_RESPONSE = {
    raw_text: []
};
Constants.OCR_TIMEOUT = 30000;
exports.default = Constants;
//# sourceMappingURL=constants.js.map