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
// TODO update regex rules
var AADHAAR_REGEX = {
    title: /Unique|UNIQUE|Identification|IDENTIFICATION|Enrollment|ENROLLMENT/,
    govt: /Government|GOVERNMENT|India|INDIA/,
    dob_heading: /Dob|DOB|Year|YEAR|Birth|BIRTH|(\d\d\/\d\d\/\d+)/,
    relative_name_heading: /Father|FATHER|Mother|MOTHER|Husband|HUSBAND|Wife|WIFE/,
    date_format: /(\d{2}\/\d{2}\/\d{4})/,
    gender: /Male|MALE|Female|FEMALE/,
    document: /Aadhaar|AADHAAR/,
    number_format: /[\d\s]{12,}/,
    name_format: /^[a-zA-Z\s\.]+$/,
    address_start: /([Ss]\/[Oo])|([Ww]\/[Oo])|([Dd]\/[Oo])|([Cc]\/[Oo])|(Address|ADDRESS)/,
    address_start_split: /,/,
    noise: /(^[\s]+$)|(^[A-Z]{0,2}[.,]+$)|(^[a-z])|(^[A-Z0-9]{2,}[a-z]+)|(^[A-Z0-9]+[a-z]+[A-Z]+)|(^[A-Z0-9]+[.,]+[A-Z0-9]+)|(^[0-9]+[a-zA-Z]{2,})/,
    address_end: /([A-Z\s]+[a-z]*[,-\s]+[0-9]{6}$)|(^[0-9]{6}$)/,
    fathers_name_split: /([Ss]\/[Oo])[\s:]+|([Dd]\/[Oo])[\s:]+|([Cc]\/[Oo])[\s:]+|([Ww]\/[Oo])[\s:]+/
};
var LINE_MIN_SIZE = 4;
var AadhaarParser = {};
// ******************************************************* //
// Logic for internal functions starts here                //
// ******************************************************* //
var filterNoiseFromLine = function (lineText) {
    var spaceSplit = lineText.split(/\s/);
    var filteredSpacedList = lodash_1.default.filter(spaceSplit, function (word) {
        if (AADHAAR_REGEX["gender"].exec(word) ||
            AADHAAR_REGEX["date_format"].exec(word)) {
            return true;
        }
        if (AADHAAR_REGEX["noise"].exec(word)) {
            return false;
        }
        return true;
    });
    return lodash_1.default.join(filteredSpacedList, " ");
};
var removeNoiseFromText = function (lines) {
    var filteredLines = [];
    lodash_1.default.forEach(lines, function (line) {
        if (lodash_1.default.size(line) >= LINE_MIN_SIZE) {
            var filteredText = filterNoiseFromLine(line);
            filteredLines.push(filteredText);
        }
    });
    return lodash_1.default.filter(filteredLines, function (line) {
        return !lodash_1.default.isEmpty(line);
    });
};
var parseAadhaarHeadingLineNumbers = function (lines) {
    var aadhaarHeadingLineNumbers = {
        aadhar_title_text_line: undefined,
        aadhar_document_text_line: undefined,
        aadhar_govt_text_line: undefined,
        aadhar_dob_text_line: undefined,
        aadhar_gender_text_line: undefined,
        aadhar_number_text_line: undefined,
        aadhar_relative_name_text_line: undefined,
        aadhar_address_start_line: undefined,
        aadhar_address_end_line: undefined
    };
    lodash_1.default.forEach(lines, function (line, index) {
        if (AADHAAR_REGEX["title"].exec(line)) {
            aadhaarHeadingLineNumbers["aadhar_title_text_line"] = index;
        }
        else if (AADHAAR_REGEX["document"].exec(line)) {
            aadhaarHeadingLineNumbers["aadhar_document_text_line"] = index;
        }
        else if (AADHAAR_REGEX["govt"].exec(line)) {
            aadhaarHeadingLineNumbers["aadhar_govt_text_line"] = index;
        }
        else if (!aadhaarHeadingLineNumbers["aadhar_dob_text_line"] &&
            AADHAAR_REGEX["dob_heading"].exec(line)) {
            aadhaarHeadingLineNumbers["aadhar_dob_text_line"] = index;
        }
        else if (!aadhaarHeadingLineNumbers["aadhar_gender_text_line"] &&
            AADHAAR_REGEX["gender"].exec(line)) {
            aadhaarHeadingLineNumbers["aadhar_gender_text_line"] = index;
        }
        else if (!aadhaarHeadingLineNumbers["aadhar_number_text_line"] &&
            AADHAAR_REGEX["number_format"].exec(line)) {
            aadhaarHeadingLineNumbers["aadhar_number_text_line"] = index;
        }
        else if (!aadhaarHeadingLineNumbers["aadhar_relative_name_text_line"] &&
            AADHAAR_REGEX["relative_name_heading"].exec(line)) {
            aadhaarHeadingLineNumbers["aadhar_relative_name_text_line"] = index;
        }
        else if (AADHAAR_REGEX["address_start"].exec(line)) {
            aadhaarHeadingLineNumbers["aadhar_address_start_line"] = index;
        }
        else if (aadhaarHeadingLineNumbers["aadhar_address_start_line"] &&
            AADHAAR_REGEX["address_end"].exec(line)) {
            aadhaarHeadingLineNumbers["aadhar_address_end_line"] = index;
        }
    });
    return aadhaarHeadingLineNumbers;
};
var removeDispositionedText = function (noiseFreeText, aadhaarHeadingLineNumbers) {
    var aadhaarGenderTextLine = aadhaarHeadingLineNumbers["aadhar_gender_text_line"];
    if (aadhaarGenderTextLine) {
        var aadhaarNumberLine = aadhaarGenderTextLine + 1;
        var aadhaarNumber = noiseFreeText[aadhaarNumberLine];
        if (!AADHAAR_REGEX["number_format"].exec(aadhaarNumber)) {
            noiseFreeText[aadhaarNumberLine] = undefined;
        }
    }
    return lodash_1.default.filter(noiseFreeText, function (line) {
        return !lodash_1.default.isEmpty(line);
    });
};
var processAadhaarGender = function (text) {
    return lodash_1.default.get(constants_1.default, "GENDER." + text);
};
var processAadhaarName = function (textLines, aadhaarHeadingLineNumbers) {
    var aadhaarRelativeNamePrevLine = lodash_1.default.isNumber(aadhaarHeadingLineNumbers["aadhar_relative_name_text_line"]) &&
        aadhaarHeadingLineNumbers["aadhar_relative_name_text_line"] - 1;
    if (aadhaarRelativeNamePrevLine &&
        AADHAAR_REGEX["name_format"].exec(textLines[aadhaarRelativeNamePrevLine])) {
        return textLines[aadhaarRelativeNamePrevLine];
    }
    var aadhaarGovtTextNextLine = lodash_1.default.isNumber(aadhaarHeadingLineNumbers["aadhar_govt_text_line"]) &&
        aadhaarHeadingLineNumbers["aadhar_govt_text_line"] + 1;
    var aadhaarDOBTextPrevLine = lodash_1.default.isNumber(aadhaarHeadingLineNumbers["aadhar_dob_text_line"]) &&
        aadhaarHeadingLineNumbers["aadhar_dob_text_line"] - 1;
    if (aadhaarGovtTextNextLine <= aadhaarDOBTextPrevLine &&
        AADHAAR_REGEX["name_format"].exec(textLines[aadhaarGovtTextNextLine])) {
        return textLines[aadhaarGovtTextNextLine];
    }
    if (!aadhaarHeadingLineNumbers["aadhar_address_start_line"] &&
        aadhaarDOBTextPrevLine &&
        AADHAAR_REGEX["name_format"].exec(textLines[aadhaarDOBTextPrevLine])) {
        return textLines[aadhaarDOBTextPrevLine];
    }
    return undefined;
};
var processAadhaarNumber = function (text) {
    if (lodash_1.default.isEmpty(text)) {
        return undefined;
    }
    var numbers = text.replace(/ +/g, "");
    var parsedNumbers = numbers
        .replace("O", "0")
        .replace("D", "0")
        .replace("B", "8")
        .replace("S", "5")
        .replace("I", "1")
        .replace("!", "1")
        .replace("l", "1");
    if (AADHAAR_REGEX["number_format"].exec(parsedNumbers)) {
        return parsedNumbers;
    }
    return undefined;
};
var parseAadhaarNumber = function (textLines, aadhaarHeadingLineNumbers) {
    var aadhaarGenderLine = aadhaarHeadingLineNumbers["aadhar_gender_text_line"];
    if (lodash_1.default.isNumber(aadhaarGenderLine)) {
        return processAadhaarNumber(textLines[aadhaarGenderLine + 1]);
    }
    var aadhaarDOBLine = aadhaarHeadingLineNumbers["aadhar_dob_text_line"];
    if (lodash_1.default.isNumber(aadhaarDOBLine)) {
        return processAadhaarNumber(textLines[aadhaarDOBLine + 2]);
    }
    return undefined;
};
var getAddressStartLineTokens = function (rawAddressStartText) {
    var addressRelevantTokens = lodash_1.default.split(rawAddressStartText, AADHAAR_REGEX["address_start"]);
    var addressRelevantString = lodash_1.default.join(lodash_1.default.slice(addressRelevantTokens, 1), "");
    var addressSplit = lodash_1.default.split(addressRelevantString, AADHAAR_REGEX["address_start_split"]);
    return addressSplit;
};
var getAddressEndLineText = function (rawAddressEndText) {
    var addressRelevantTokens = lodash_1.default.split(rawAddressEndText, AADHAAR_REGEX["address_end"]);
    var filteredText = lodash_1.default.filter(addressRelevantTokens, function (token) {
        return !lodash_1.default.isEmpty(token);
    });
    return lodash_1.default.last(filteredText);
};
var processAadhaaarFathersName = function (textLines, aadhaarHeadingLineNumbers) {
    var addressStartLine = aadhaarHeadingLineNumbers["aadhar_address_start_line"];
    if (!lodash_1.default.isNumber(addressStartLine)) {
        return undefined;
    }
    var addressSplit = getAddressStartLineTokens(textLines[addressStartLine]);
    if (lodash_1.default.size(addressSplit) < 2) {
        return undefined;
    }
    var fathersNameTag = lodash_1.default.get(addressSplit, "0", "");
    var fathersNameSplit = lodash_1.default.split(fathersNameTag, AADHAAR_REGEX["fathers_name_split"]);
    var fathersName = lodash_1.default.last(fathersNameSplit);
    if (AADHAAR_REGEX["name_format"].exec(fathersName)) {
        return fathersName;
    }
    return undefined;
};
var processAadhaarDOB = function (textLines, aadhaarHeadingLineNumbers) {
    var addressStartLine = aadhaarHeadingLineNumbers["aadhar_address_start_line"];
    var addressEndLine = aadhaarHeadingLineNumbers["aadhar_address_end_line"];
    if (lodash_1.default.isNumber(addressStartLine) || lodash_1.default.isNumber(addressEndLine)) {
        return undefined;
    }
    var aadhaarDOBLine = aadhaarHeadingLineNumbers["aadhar_dob_text_line"];
    var dobMatch = AADHAAR_REGEX["date_format"].exec(textLines[aadhaarDOBLine]);
    var dateText = lodash_1.default.get(dobMatch, "0");
    if (lodash_1.default.isEmpty(dateText)) {
        return undefined;
    }
    return moment.utc(dateText, "DD/MM/YYYY").toISOString();
};
var processAadhaarAddress = function (textLines, aadhaarHeadingLineNumbers) {
    var addressStartLine = aadhaarHeadingLineNumbers["aadhar_address_start_line"];
    var addressEndLine = aadhaarHeadingLineNumbers["aadhar_address_end_line"];
    if (!lodash_1.default.isNumber(addressStartLine) || !lodash_1.default.isNumber(addressEndLine)) {
        return undefined;
    }
    var addressLines = [];
    var addressStartSplit = getAddressStartLineTokens(textLines[addressStartLine]);
    if (lodash_1.default.size(addressStartSplit) > 1) {
        var relevantTokens = lodash_1.default.slice(addressStartSplit, 1);
        lodash_1.default.forEach(relevantTokens, function (token) {
            addressLines.push(token);
        });
    }
    lodash_1.default.forEach(lodash_1.default.range(addressStartLine + 1, addressEndLine), function (lineNumber) {
        addressLines.push(textLines[lineNumber]);
    });
    var addressEndRelevantText = getAddressEndLineText(textLines[addressEndLine]);
    addressLines.push(addressEndRelevantText);
    return lodash_1.default.join(addressLines, " ");
};
var parseAadhaarText = function (textLines, aadhaarHeadingLineNumbers) {
    var parsedResult = {
        document_type: constants_1.default.DOCUMENT_TYPES.AADHAAR_CARD
    };
    var aadhaarGenderLine = aadhaarHeadingLineNumbers["aadhar_gender_text_line"];
    var genderMatch = AADHAAR_REGEX["gender"].exec(textLines[aadhaarGenderLine]);
    parsedResult.gender = processAadhaarGender(lodash_1.default.get(genderMatch, "0"));
    var name = processAadhaarName(textLines, aadhaarHeadingLineNumbers);
    var aadhaarNumber = parseAadhaarNumber(textLines, aadhaarHeadingLineNumbers);
    var address = processAadhaarAddress(textLines, aadhaarHeadingLineNumbers);
    var fathersName = processAadhaaarFathersName(textLines, aadhaarHeadingLineNumbers);
    var dateOfBirth = processAadhaarDOB(textLines, aadhaarHeadingLineNumbers);
    parsedResult.identification_number = aadhaarNumber;
    parsedResult.name = name;
    parsedResult.date_of_birth = dateOfBirth;
    parsedResult.address = address;
    parsedResult.fathers_name = fathersName;
    return parsedResult;
};
var filterRelevantAadhaarText = function (rawTextLines) {
    var noiseFreeText = removeNoiseFromText(rawTextLines);
    var aadhaarHeadingLineNumbers = parseAadhaarHeadingLineNumbers(noiseFreeText);
    var filteredText = removeDispositionedText(noiseFreeText, aadhaarHeadingLineNumbers);
    return filteredText;
};
var validateAadhaarText = function (aadhaarHeadingLineNumbers) {
    var aadharNumberTextLine = aadhaarHeadingLineNumbers.aadhar_number_text_line, aadharTitleTextLine = aadhaarHeadingLineNumbers.aadhar_title_text_line, aadharDocumentTextLine = aadhaarHeadingLineNumbers.aadhar_document_text_line;
    return (lodash_1.default.isNumber(aadharNumberTextLine) ||
        lodash_1.default.isNumber(aadharTitleTextLine) ||
        lodash_1.default.isNumber(aadharDocumentTextLine));
};
// ******************************************************* //
// Logic for internal functions ends here                  //
// ******************************************************* //
// ******************************************************* //
// Logic for API handlers starts here                      //
// ******************************************************* //
AadhaarParser.parseDocumentDetails = function (params) {
    var rawTextLines = params.raw_text;
    var textLines = filterRelevantAadhaarText(rawTextLines);
    var aadhaarHeadingLineNumbers = parseAadhaarHeadingLineNumbers(textLines);
    var isDocumentValid = validateAadhaarText(aadhaarHeadingLineNumbers);
    if (!isDocumentValid) {
        return constants_1.default.INVALID_DOCUMENT_RESPONSE;
    }
    var parsedDetails = parseAadhaarText(textLines, aadhaarHeadingLineNumbers);
    return {
        is_document_valid: true,
        document_details: parsedDetails
    };
};
// ******************************************************* //
// Logic for API handlers ends here                        //
// ******************************************************* //
exports.default = AadhaarParser;
//# sourceMappingURL=aadhaar-parser.js.map