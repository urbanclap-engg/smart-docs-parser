import _ from "lodash";
import * as moment from "moment";
import Constants from "../constants";
import {
  ParseDocumentDetailsRequest,
  ParseDocumentDetailsResponse
} from "../interfaces/DocumentParser";

// TODO update regex rules
const AADHAAR_REGEX = {
  title: /Unique|UNIQUE|Identification|IDENTIFICATION|Enrollment|ENROLLMENT/,
  govt: /Government|GOVERNMENT|India|INDIA/,
  dob_heading: /Dob|DOB|Year|YEAR|Birth|BIRTH|(\d\d\/\d\d\/\d+)/,
  relative_name_heading: /Father|FATHER|Mother|MOTHER|Husband|HUSBAND|Wife|WIFE/,
  date_format: /(\d{2}\/\d{2}\/\d{4})/,
  gender: /Male|MALE|Female|FEMALE/,
  document: /Aadhaar|AADHAAR/,
  number_format: /[\d\s]{12,}/,
  name_format: /^[a-zA-Z\s\.]+$/,
  address_start: /([Ss]\/[Oo])|([Ww]\/[Oo])|([Dd]\/[Oo])|([Cc]\/[Oo])|(Address[:\s]*)|(ADDRESS[:\s]*)/,
  address_head: /Address[:\s]*|ADDRESS[:\s]*/,
  address_start_split: /,/,
  noise: /(^[\s]+$)|(^[A-Z]{0,2}[.,]+$)|(^[A-Z0-9]{2,}[a-z]+)|(^[A-Z0-9]+[.,]+[A-Z0-9]+)|(^[0-9]+[a-zA-Z]{3,})|(^www\.\w+)|(\.gov\.in*$)/,
  address_end: /([A-Z\s]+[a-z]*[,;:._\s-]+[0-9]{6}\.?$)|(^[0-9]{6}\.?$)/,
  fathers_name_split: /([Ss]\/[Oo])[\s:]+|([Dd]\/[Oo])[\s:]+|([Cc]\/[Oo])[\s:]+|([Ww]\/[Oo])[\s:]+/,
  english: /(^[\w,.:;&*\/|)('"#+^`-]*$)/,
  local_language_reverse_prefix: /[^\w\s,.:;&*\/|)('"#+^`-]+.*/,
  unwanted_prefix_suffix: /(^[\s.,-]+)|([\s.,-]+$)/g
};

const LINE_MIN_SIZE = 4;

const AadhaarParser: any = {};

// ******************************************************* //
// Logic for internal functions starts here                //
// ******************************************************* //

const filterNoiseFromLine = (lineText: string) => {
  const spaceSplit = lineText.split(/\s/);
  const filteredSpacedList = _.filter(spaceSplit, word => {
    if (
      AADHAAR_REGEX["gender"].exec(word) ||
      AADHAAR_REGEX["date_format"].exec(word)
    ) {
      return true;
    }
    if (AADHAAR_REGEX["noise"].exec(word)) {
      return false;
    }
    if (!AADHAAR_REGEX["english"].exec(word)) {
      return false;
    }
    return true;
  });
  return _.join(filteredSpacedList, " ");
};

const removeNoiseFromText = (lines: Array<string>) => {
  const filteredLines = [];
  _.forEach(lines, line => {
    const reverseLine = line
      .split("")
      .reverse()
      .join("");
    const reverseLineWithoutLocalLanguage = _.replace(
      reverseLine,
      AADHAAR_REGEX["local_language_reverse_prefix"],
      ""
    );
    const lineWithoutLocalLanguage = reverseLineWithoutLocalLanguage
      .split("")
      .reverse()
      .join("")
      .trim();
    if (_.size(lineWithoutLocalLanguage) >= LINE_MIN_SIZE) {
      const filteredText = filterNoiseFromLine(lineWithoutLocalLanguage);
      filteredLines.push(filteredText);
    }
  });
  return _.filter(filteredLines, line => {
    return !_.isEmpty(line);
  });
};

const parseAadhaarHeadingLineNumbers = (lines: Array<string>) => {
  const aadhaarHeadingLineNumbers = {
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
  _.forEach(lines, (line, index) => {
    if (AADHAAR_REGEX["title"].exec(line)) {
      aadhaarHeadingLineNumbers["aadhar_title_text_line"] = index;
    } else if (AADHAAR_REGEX["document"].exec(line)) {
      aadhaarHeadingLineNumbers["aadhar_document_text_line"] = index;
    } else if (AADHAAR_REGEX["govt"].exec(line)) {
      aadhaarHeadingLineNumbers["aadhar_govt_text_line"] = index;
    } else if (
      aadhaarHeadingLineNumbers["aadhar_dob_text_line"] === undefined &&
      AADHAAR_REGEX["dob_heading"].exec(line)
    ) {
      aadhaarHeadingLineNumbers["aadhar_dob_text_line"] = index;
    } else if (
      aadhaarHeadingLineNumbers["aadhar_gender_text_line"] === undefined &&
      AADHAAR_REGEX["gender"].exec(line)
    ) {
      aadhaarHeadingLineNumbers["aadhar_gender_text_line"] = index;
    } else if (
      aadhaarHeadingLineNumbers["aadhar_number_text_line"] === undefined &&
      AADHAAR_REGEX["number_format"].exec(line)
    ) {
      aadhaarHeadingLineNumbers["aadhar_number_text_line"] = index;
    } else if (
      aadhaarHeadingLineNumbers["aadhar_relative_name_text_line"] === undefined &&
      AADHAAR_REGEX["relative_name_heading"].exec(line)
    ) {
      aadhaarHeadingLineNumbers["aadhar_relative_name_text_line"] = index;
    } else if (
      aadhaarHeadingLineNumbers["aadhar_address_start_line"] === undefined &&
      AADHAAR_REGEX["address_start"].exec(line)
    ) {
      aadhaarHeadingLineNumbers["aadhar_address_start_line"] = index;
    } else if (
      aadhaarHeadingLineNumbers["aadhar_address_start_line"] !== undefined &&
      aadhaarHeadingLineNumbers["aadhar_address_end_line"] === undefined &&
      AADHAAR_REGEX["address_end"].exec(line)
    ) {
      aadhaarHeadingLineNumbers["aadhar_address_end_line"] = index;
    }
  });

  return aadhaarHeadingLineNumbers;
};

const removeDispositionedText = (
  noiseFreeText: Array<string>,
  aadhaarHeadingLineNumbers: Record<string, any>
) => {
  const aadhaarGenderTextLine =
    aadhaarHeadingLineNumbers["aadhar_gender_text_line"];
  if (aadhaarGenderTextLine) {
    const aadhaarNumberLine = aadhaarGenderTextLine + 1;
    const aadhaarNumber = noiseFreeText[aadhaarNumberLine];
    if (!AADHAAR_REGEX["number_format"].exec(aadhaarNumber)) {
      noiseFreeText[aadhaarNumberLine] = undefined;
    }
  }
  return _.filter(noiseFreeText, line => {
    return !_.isEmpty(line);
  });
};

const processAadhaarGender = (text: string) => {
  return _.get(Constants, `GENDER.${text}`);
};

const processAadhaarName = (
  textLines: Array<string>,
  aadhaarHeadingLineNumbers: Record<string, any>
) => {
  const aadhaarRelativeNamePrevLine =
    _.isNumber(aadhaarHeadingLineNumbers["aadhar_relative_name_text_line"]) &&
    aadhaarHeadingLineNumbers["aadhar_relative_name_text_line"] - 1;
  if (
    aadhaarRelativeNamePrevLine &&
    AADHAAR_REGEX["name_format"].exec(textLines[aadhaarRelativeNamePrevLine])
  ) {
    return textLines[aadhaarRelativeNamePrevLine];
  }

  const aadhaarGovtTextNextLine =
    _.isNumber(aadhaarHeadingLineNumbers["aadhar_govt_text_line"]) &&
    aadhaarHeadingLineNumbers["aadhar_govt_text_line"] + 1;
  const aadhaarDOBTextPrevLine =
    _.isNumber(aadhaarHeadingLineNumbers["aadhar_dob_text_line"]) &&
    aadhaarHeadingLineNumbers["aadhar_dob_text_line"] - 1;
  if (
    aadhaarGovtTextNextLine <= aadhaarDOBTextPrevLine &&
    AADHAAR_REGEX["name_format"].exec(textLines[aadhaarGovtTextNextLine])
  ) {
    return textLines[aadhaarGovtTextNextLine];
  }

  if (
    !aadhaarHeadingLineNumbers["aadhar_address_start_line"] &&
    aadhaarDOBTextPrevLine &&
    AADHAAR_REGEX["name_format"].exec(textLines[aadhaarDOBTextPrevLine])
  ) {
    return textLines[aadhaarDOBTextPrevLine];
  }
  return undefined;
};

const processAadhaarNumber = (text: string) => {
  if (_.isEmpty(text)) {
    return undefined;
  }
  const numbers = text.replace(/ +/g, "");
  const parsedNumbers = numbers
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

const parseAadhaarNumber = (
  textLines: Array<string>,
  aadhaarHeadingLineNumbers: Record<string, any>
) => {
  const aadhaarGenderLine =
    aadhaarHeadingLineNumbers["aadhar_gender_text_line"];
  if (_.isNumber(aadhaarGenderLine)) {
    return processAadhaarNumber(textLines[aadhaarGenderLine + 1]);
  }
  const aadhaarDOBLine = aadhaarHeadingLineNumbers["aadhar_dob_text_line"];
  if (_.isNumber(aadhaarDOBLine)) {
    return processAadhaarNumber(textLines[aadhaarDOBLine + 2]);
  }
  return undefined;
};

const getAddressStartLineTokens = (rawAddressStartText: string) => {
  const addressRelevantTokens = _.split(
    rawAddressStartText,
    AADHAAR_REGEX["address_head"]
  );
  const addressRelevantString = _.join(addressRelevantTokens, "");
  const addressSplit = _.split(
    addressRelevantString,
    AADHAAR_REGEX["address_start_split"]
  );
  return addressSplit;
};

const getAddressEndLineText = (rawAddressEndText: string) => {
  const addressRelevantTokens = _.split(
    rawAddressEndText,
    AADHAAR_REGEX["address_end"]
  );
  const filteredText = _.filter(addressRelevantTokens, token => {
    return !_.isEmpty(token);
  });
  return _.last(filteredText);
};

const processAadhaaarFathersName = (
  textLines: Array<string>,
  aadhaarHeadingLineNumbers: Record<string, any>
) => {
  const addressStartLine =
    aadhaarHeadingLineNumbers["aadhar_address_start_line"];
  if (!_.isNumber(addressStartLine)) {
    return undefined;
  }
  const addressSplit = getAddressStartLineTokens(textLines[addressStartLine]);
  if (_.size(addressSplit) < 2) {
    return undefined;
  }
  const fathersNameTag = _.get(addressSplit, "0", "");
  const fathersNameSplit = _.split(
    fathersNameTag,
    AADHAAR_REGEX["fathers_name_split"]
  );
  const fathersName = _.last(fathersNameSplit);
  if (AADHAAR_REGEX["name_format"].exec(fathersName)) {
    return fathersName;
  }
  return undefined;
};

const processAadhaarDOB = (
  textLines: Array<string>,
  aadhaarHeadingLineNumbers: Record<string, any>
) => {
  const addressStartLine =
    aadhaarHeadingLineNumbers["aadhar_address_start_line"];
  const addressEndLine = aadhaarHeadingLineNumbers["aadhar_address_end_line"];

  if (_.isNumber(addressStartLine) || _.isNumber(addressEndLine)) {
    return undefined;
  }
  const aadhaarDOBLine = aadhaarHeadingLineNumbers["aadhar_dob_text_line"];
  const dobMatch = AADHAAR_REGEX["date_format"].exec(textLines[aadhaarDOBLine]);
  const dateText = _.get(dobMatch, "0");
  if (_.isEmpty(dateText)) {
    return undefined;
  }
  return moment.utc(dateText, "DD/MM/YYYY").toISOString();
};

const processAadhaarAddress = (
  textLines: Array<string>,
  aadhaarHeadingLineNumbers: Record<string, any>
) => {
  const addressStartLine =
    aadhaarHeadingLineNumbers["aadhar_address_start_line"];
  const addressEndLine = aadhaarHeadingLineNumbers["aadhar_address_end_line"];

  if (!_.isNumber(addressStartLine) || !_.isNumber(addressEndLine)) {
    return undefined;
  }
  const addressLines = [];
  const addressStartSplit = getAddressStartLineTokens(
    textLines[addressStartLine]
  );
  _.forEach(addressStartSplit, token => {
    if (!_.isEmpty(token)) {
      addressLines.push(token);
    }
  });
  _.forEach(_.range(addressStartLine + 1, addressEndLine), lineNumber => {
    addressLines.push(textLines[lineNumber]);
  });
  addressLines.push(textLines[addressEndLine]);
  const address = _.join(addressLines, " ");
  return _.replace(address, AADHAAR_REGEX["unwanted_prefix_suffix"], "");
};

const parseAadhaarText = (
  textLines: Array<string>,
  aadhaarHeadingLineNumbers: Record<string, any>
) => {
  const parsedResult: any = {
    document_type: Constants.DOCUMENT_TYPES.AADHAAR_CARD
  };
  const aadhaarGenderLine =
    aadhaarHeadingLineNumbers["aadhar_gender_text_line"];
  const genderMatch = AADHAAR_REGEX["gender"].exec(
    textLines[aadhaarGenderLine]
  );
  parsedResult.gender = processAadhaarGender(_.get(genderMatch, "0"));

  const name = processAadhaarName(textLines, aadhaarHeadingLineNumbers);
  const aadhaarNumber = parseAadhaarNumber(
    textLines,
    aadhaarHeadingLineNumbers
  );
  const address = processAadhaarAddress(textLines, aadhaarHeadingLineNumbers);
  const fathersName = processAadhaaarFathersName(
    textLines,
    aadhaarHeadingLineNumbers
  );
  const dateOfBirth = processAadhaarDOB(textLines, aadhaarHeadingLineNumbers);

  parsedResult.identification_number = aadhaarNumber;
  parsedResult.name = name;
  parsedResult.date_of_birth = dateOfBirth;
  parsedResult.address = address;
  parsedResult.fathers_name = fathersName;

  return parsedResult;
};

const filterRelevantAadhaarText = (rawTextLines: Array<string>) => {
  const noiseFreeText = removeNoiseFromText(rawTextLines);
  const aadhaarHeadingLineNumbers = parseAadhaarHeadingLineNumbers(
    noiseFreeText
  );
  const filteredText = removeDispositionedText(
    noiseFreeText,
    aadhaarHeadingLineNumbers
  );
  return filteredText;
};

const validateAadhaarText = (
  aadhaarHeadingLineNumbers: Record<string, any>
) => {
  const {
    aadhar_number_text_line: aadharNumberTextLine,
    aadhar_title_text_line: aadharTitleTextLine,
    aadhar_document_text_line: aadharDocumentTextLine,
    aadhar_address_start_line: aadharAddressStartLine,
    aadhar_address_end_line: aadharAddressEndLine
  } = aadhaarHeadingLineNumbers;
  return (
    _.isNumber(aadharNumberTextLine) ||
    _.isNumber(aadharTitleTextLine) ||
    _.isNumber(aadharDocumentTextLine) ||
    _.isNumber(aadharAddressStartLine) ||
    _.isNumber(aadharAddressEndLine)
  );
};

// ******************************************************* //
// Logic for internal functions ends here                  //
// ******************************************************* //

// ******************************************************* //
// Logic for API handlers starts here                      //
// ******************************************************* //
AadhaarParser.parseDocumentDetails = (
  params: ParseDocumentDetailsRequest
): ParseDocumentDetailsResponse => {
  const { raw_text: rawTextLines } = params;
  const textLines = filterRelevantAadhaarText(rawTextLines);
  const aadhaarHeadingLineNumbers = parseAadhaarHeadingLineNumbers(textLines);
  const isDocumentValid = validateAadhaarText(aadhaarHeadingLineNumbers);
  if (!isDocumentValid) {
    return Constants.INVALID_DOCUMENT_RESPONSE;
  }

  const parsedDetails = parseAadhaarText(textLines, aadhaarHeadingLineNumbers);
  return {
    is_document_valid: true,
    document_details: parsedDetails
  };
};
// ******************************************************* //
// Logic for API handlers ends here                        //
// ******************************************************* //

export default AadhaarParser;
