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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var lodash_1 = __importDefault(require("lodash"));
var moment = __importStar(require("moment"));
var constants_1 = __importDefault(require("../constants"));
var PAN_REGEX = {
    govt: /GOVT|INDIA/,
    income_tax: /INCOME|TAX/,
    fathers_name_heading: /Father/i,
    dob_heading: /Date|Birth/,
    date_format: /(\d{2}\/\d{2}\/\d{4})/,
    number_heading: /Permanent|Account|Number/i,
    number_format: /[A-Z0-9]{10,}/,
    words_format: /^[A-Z]+[A-Z\s.]+$/
};
var PAN_BASIC_MAP = {
    name: -3,
    fathers_name: -2,
    dob: -1,
    number: 1
};
var LINE_MIN_SIZE = 3;
var PANParser = {};
// ******************************************************* //
// Logic for internal functions starts here                //
// ******************************************************* //
var filterNoiseFromLine = function (lineText) {
    var panRegexKeys = lodash_1.default.keys(PAN_REGEX);
    var spaceSplit = lineText.split(/\s/);
    var filteredSpacedList = lodash_1.default.filter(spaceSplit, function (word) {
        return lodash_1.default.some(panRegexKeys, function (key) {
            return PAN_REGEX[key].exec(word);
        });
    });
    return lodash_1.default.join(filteredSpacedList, " ");
};
var removeNoiseFromText = function (lines) {
    var filteredLines = [];
    lodash_1.default.forEach(lines, function (line) {
        if (lodash_1.default.size(line) > LINE_MIN_SIZE) {
            var filteredText = filterNoiseFromLine(line);
            filteredLines.push(filteredText);
        }
    });
    return lodash_1.default.filter(filteredLines, function (line) {
        return !lodash_1.default.isEmpty(line);
    });
};
var parsePANHeadingLineNumbers = function (lines) {
    var panHeadingLineNumbers = {
        pan_number_text_line: undefined,
        pan_IT_text_line: undefined,
        pan_GOVT_text_line: undefined,
        pan_DOB_text_line: undefined,
        pan_name_text_line: undefined,
        pan_fathers_name_text_line: undefined
    };
    lodash_1.default.forEach(lines, function (line, index) {
        if (!panHeadingLineNumbers["pan_number_text_line"] &&
            PAN_REGEX["number_heading"].exec(line)) {
            panHeadingLineNumbers["pan_number_text_line"] = index;
        }
        else if (!panHeadingLineNumbers["pan_IT_text_line"] &&
            PAN_REGEX["income_tax"].exec(line)) {
            panHeadingLineNumbers["pan_IT_text_line"] = index;
        }
        else if (!panHeadingLineNumbers["pan_GOVT_text_line"] &&
            PAN_REGEX["govt"].exec(line)) {
            panHeadingLineNumbers["pan_GOVT_text_line"] = index;
        }
        else if (!panHeadingLineNumbers["pan_fathers_name_text_line"] &&
            PAN_REGEX["fathers_name_heading"].exec(line)) {
            panHeadingLineNumbers["pan_fathers_name_text_line"] = index;
        }
        else if (!panHeadingLineNumbers["pan_DOB_text_line"] &&
            PAN_REGEX["dob_heading"].exec(line)) {
            panHeadingLineNumbers["pan_DOB_text_line"] = index;
        }
    });
    return panHeadingLineNumbers;
};
var processPANNumber = function (text) {
    if (lodash_1.default.isEmpty(text)) {
        return undefined;
    }
    var preFix = text.substr(0, 5);
    var numbers = text.substr(5, 4);
    var suffix = text[9];
    var preFixProcessed = preFix
        .replace("0", "O")
        .replace("8", "B")
        .replace("5", "S")
        .replace("1", "I");
    var numbersProcessed = numbers
        .replace("O", "0")
        .replace("D", "0")
        .replace("B", "8")
        .replace("S", "5")
        .replace("I", "1")
        .replace("!", "1");
    var suffixProcessed = suffix
        .replace("0", "O")
        .replace("8", "B")
        .replace("5", "S")
        .replace("1", "I");
    return preFixProcessed.concat(numbersProcessed).concat(suffixProcessed);
};
var processPANDateOfBirth = function (text) {
    if (lodash_1.default.isEmpty(text)) {
        return undefined;
    }
    return moment.utc(text, "DD/MM/YYYY").toISOString();
};
var getPANFormat = function (panHeadingLineNumbers) {
    if (panHeadingLineNumbers["pan_number_text_line"] &&
        !(panHeadingLineNumbers["pan_DOB_text_line"] ||
            panHeadingLineNumbers["pan_name_text_line"] ||
            panHeadingLineNumbers["pan_fathers_name_text_line"])) {
        return constants_1.default.PAN_FORMATS.BASIC;
    }
    return constants_1.default.PAN_FORMATS.ADVANCED;
};
var removeMisplacedText = function (noiseFreeText, panHeadingLineNumbers) {
    var panNumberHeadingLine = panHeadingLineNumbers["pan_number_text_line"];
    if (panNumberHeadingLine) {
        var panNumberLine = panNumberHeadingLine + 1;
        var panNumber = processPANNumber(noiseFreeText[panNumberLine]);
        if (!PAN_REGEX["number_format"].exec(panNumber)) {
            noiseFreeText[panNumberLine] = undefined;
        }
    }
    var panDOBHeadingLine = panHeadingLineNumbers["pan_DOB_text_line"];
    if (panDOBHeadingLine) {
        var panDOBLine = panDOBHeadingLine + 1;
        var panDOBText = noiseFreeText[panDOBLine];
        if (!PAN_REGEX["date_format"].exec(panDOBText)) {
            noiseFreeText[panDOBLine] = undefined;
        }
    }
    var panFathersNameHeadingLine = panHeadingLineNumbers["pan_fathers_name_text_line"];
    if (panFathersNameHeadingLine) {
        var panFathersNameLine = panFathersNameHeadingLine + 1;
        var panFathersNameText = noiseFreeText[panFathersNameLine];
        if (!PAN_REGEX["words_format"].exec(panFathersNameText)) {
            noiseFreeText[panFathersNameLine] = undefined;
        }
        var panNameLine = panFathersNameHeadingLine - 1;
        var panNameText = noiseFreeText[panNameLine];
        if (!PAN_REGEX["words_format"].exec(panNameText)) {
            noiseFreeText[panNameLine] = undefined;
        }
    }
    return lodash_1.default.filter(noiseFreeText, function (line) {
        return !lodash_1.default.isEmpty(line);
    });
};
var parseBasicPANText = function (textLines, panHeadingLineNumbers) {
    var parsedResult = {
        document_type: constants_1.default.DOCUMENT_TYPES.PAN_CARD
    };
    var panNumberHeadingLine = panHeadingLineNumbers["pan_number_text_line"];
    var panNumberLine = panNumberHeadingLine + PAN_BASIC_MAP["number"];
    var panNameLine = panNumberHeadingLine + PAN_BASIC_MAP["name"];
    var panDOBLine = panNumberHeadingLine + PAN_BASIC_MAP["dob"];
    var panFatherNameLine = panNumberHeadingLine + PAN_BASIC_MAP["fathers_name"];
    parsedResult.identification_number = processPANNumber(textLines[panNumberLine]);
    parsedResult.name = textLines[panNameLine];
    parsedResult.date_of_birth = processPANDateOfBirth(textLines[panDOBLine]);
    parsedResult.fathers_name = textLines[panFatherNameLine];
    return parsedResult;
};
var parseAdvancePANText = function (textLines, panHeadingLineNumbers) {
    var parsedResult = {
        document_type: constants_1.default.DOCUMENT_TYPES.PAN_CARD
    };
    var panNumberLine = lodash_1.default.isNumber(panHeadingLineNumbers["pan_number_text_line"]) &&
        panHeadingLineNumbers["pan_number_text_line"] + 1;
    var panDOBLine = lodash_1.default.isNumber(panHeadingLineNumbers["pan_DOB_text_line"]) &&
        panHeadingLineNumbers["pan_DOB_text_line"] + 1;
    var panFatherNameLine = lodash_1.default.isNumber(panHeadingLineNumbers["pan_fathers_name_text_line"]) &&
        panHeadingLineNumbers["pan_fathers_name_text_line"] + 1;
    var panNameLine = lodash_1.default.isNumber(panHeadingLineNumbers["pan_fathers_name_text_line"]) &&
        panHeadingLineNumbers["pan_fathers_name_text_line"] - 1;
    parsedResult.identification_number = processPANNumber(textLines[panNumberLine]);
    parsedResult.name = textLines[panNameLine];
    parsedResult.date_of_birth = processPANDateOfBirth(textLines[panDOBLine]);
    parsedResult.fathers_name = textLines[panFatherNameLine];
    return parsedResult;
};
var filterRelevantPANtext = function (rawTextLines) {
    var noiseFreeText = removeNoiseFromText(rawTextLines);
    var panHeadingLineNumbers = parsePANHeadingLineNumbers(noiseFreeText);
    var filteredText = removeMisplacedText(noiseFreeText, panHeadingLineNumbers);
    return filteredText;
};
var parsePANDetails = function (textLines, panHeadingLineNumbers, panFormat) {
    if (panFormat == constants_1.default.PAN_FORMATS.BASIC) {
        return parseBasicPANText(textLines, panHeadingLineNumbers);
    }
    return parseAdvancePANText(textLines, panHeadingLineNumbers);
};
var validatePANText = function (panHeadingLineNumbers) {
    var panNumberTextLine = panHeadingLineNumbers.pan_number_text_line, panIncomeTextLine = panHeadingLineNumbers.pan_IT_text_line;
    return lodash_1.default.isNumber(panNumberTextLine) || lodash_1.default.isNumber(panIncomeTextLine);
};
// ******************************************************* //
// Logic for internal functions ends here                  //
// ******************************************************* //
// ******************************************************* //
// Logic for API handlers starts here                      //
// ******************************************************* //
PANParser.parseDocumentDetails = function (params) {
    var rawTextLines = params.raw_text;
    var textLines = filterRelevantPANtext(rawTextLines);
    var panHeadingLineNumbers = parsePANHeadingLineNumbers(textLines);
    var isDocumentValid = validatePANText(panHeadingLineNumbers);
    if (!isDocumentValid) {
        return constants_1.default.INVALID_DOCUMENT_RESPONSE;
    }
    var panFormat = getPANFormat(panHeadingLineNumbers);
    var parsedDetails = parsePANDetails(textLines, panHeadingLineNumbers, panFormat);
    return {
        is_document_valid: true,
        document_details: parsedDetails
    };
};
// ******************************************************* //
// Logic for API handlers ends here                        //
// ******************************************************* //
exports.default = PANParser;
//# sourceMappingURL=pan-parser.js.map