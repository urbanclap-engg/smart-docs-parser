import _ from "lodash";
import moment from "moment";
import Constants from "../constants";

const PAN_REGEX = {
  govt: /GOVT|INDIA/,
  income_tax: /INCOME|TAX/,
  fathers_name_heading: /Father/,
  dob_heading: /Date|Birth/,
  date_format: /(\d{2}\/\d{2}\/\d{4})/,
  number_heading: /Permanent|Account|Number/,
  number_format: /[A-Z0-9]{10,}/,
  words_format: /^[A-Z]+[A-Z\s.]+$/
};

const PAN_BASIC_MAP = {
  name: -3,
  fathers_name: -2,
  dob: -1,
  number: 1
};

const LINE_MIN_SIZE = 4;

const PANParser: any = {};

// ******************************************************* //
// Logic for internal functions starts here                //
// ******************************************************* //

const filterNoiseFromLine = (lineText: string) => {
  const panRegexKeys = _.keys(PAN_REGEX);
  const spaceSplit = lineText.split(/\s/);
  const filteredSpacedList = _.filter(spaceSplit, word => {
    return _.some(panRegexKeys, key => {
      return PAN_REGEX[key].exec(word);
    });
  });
  return _.join(filteredSpacedList, " ");
};

const removeNoiseFromText = (lines: Array<string>) => {
  const filteredLines = [];
  _.forEach(lines, line => {
    if (_.size(line) > LINE_MIN_SIZE) {
      const filteredText = filterNoiseFromLine(line);
      filteredLines.push(filteredText);
    }
  });
  return _.filter(filteredLines, line => {
    return !_.isEmpty(line);
  });
};

const parsePANHeadingLineNumbers = (lines: Array<string>) => {
  const panHeadingLineNumbers = {
    pan_number_text_line: undefined,
    pan_IT_text_line: undefined,
    pan_GOVT_text_line: undefined,
    pan_DOB_text_line: undefined,
    pan_name_text_line: undefined,
    pan_fathers_name_text_line: undefined
  };
  _.forEach(lines, (line, index) => {
    if (
      !panHeadingLineNumbers["pan_number_text_line"] &&
      PAN_REGEX["number_heading"].exec(line)
    ) {
      panHeadingLineNumbers["pan_number_text_line"] = index;
    } else if (
      !panHeadingLineNumbers["pan_IT_text_line"] &&
      PAN_REGEX["income_tax"].exec(line)
    ) {
      panHeadingLineNumbers["pan_IT_text_line"] = index;
    } else if (
      !panHeadingLineNumbers["pan_GOVT_text_line"] &&
      PAN_REGEX["govt"].exec(line)
    ) {
      panHeadingLineNumbers["pan_GOVT_text_line"] = index;
    } else if (
      !panHeadingLineNumbers["pan_fathers_name_text_line"] &&
      PAN_REGEX["fathers_name_heading"].exec(line)
    ) {
      panHeadingLineNumbers["pan_fathers_name_text_line"] = index;
    } else if (
      !panHeadingLineNumbers["pan_DOB_text_line"] &&
      PAN_REGEX["dob_heading"].exec(line)
    ) {
      panHeadingLineNumbers["pan_DOB_text_line"] = index;
    }
  });
  return panHeadingLineNumbers;
};

const processPANNumber = (text: string) => {
  if (_.isEmpty(text)) {
    return undefined;
  }
  const preFix = text.substr(0, 5);
  const numbers = text.substr(5, 4);
  const suffix = text[9];
  const preFixProcessed = preFix
    .replace("0", "O")
    .replace("8", "B")
    .replace("5", "S")
    .replace("1", "I");
  const numbersProcessed = numbers
    .replace("O", "0")
    .replace("D", "0")
    .replace("B", "8")
    .replace("S", "5")
    .replace("I", "1")
    .replace("!", "1");
  const suffixProcessed = suffix
    .replace("0", "O")
    .replace("8", "B")
    .replace("5", "S")
    .replace("1", "I");
  return preFixProcessed.concat(numbersProcessed).concat(suffixProcessed);
};

const processPANDateOfBirth = (text: string) => {
  if (_.isEmpty(text)) {
    return undefined;
  }
  return moment.utc(text, "DD/MM/YYYY");
};

const getPANFormat = (panHeadingLineNumbers: Record<string, any>) => {
  if (
    panHeadingLineNumbers["pan_number_text_line"] &&
    !(
      panHeadingLineNumbers["pan_DOB_text_line"] ||
      panHeadingLineNumbers["pan_name_text_line"] ||
      panHeadingLineNumbers["pan_fathers_name_text_line"]
    )
  ) {
    return Constants.PAN_FORMATS.BASIC;
  }
  return Constants.PAN_FORMATS.ADVANCED;
};

const removeMisplacedText = (
  noiseFreeText: Array<string>,
  panHeadingLineNumbers: Record<string, any>
) => {
  const panNumberHeadingLine = panHeadingLineNumbers["pan_number_text_line"];
  if (panNumberHeadingLine) {
    const panNumberLine = panNumberHeadingLine + 1;
    const panNumber = processPANNumber(noiseFreeText[panNumberLine]);
    if (!PAN_REGEX["number_format"].exec(panNumber)) {
      noiseFreeText[panNumberLine] = undefined;
    }
  }

  const panDOBHeadingLine = panHeadingLineNumbers["pan_DOB_text_line"];
  if (panDOBHeadingLine) {
    const panDOBLine = panDOBHeadingLine + 1;
    const panDOBText = noiseFreeText[panDOBLine];
    if (!PAN_REGEX["date_format"].exec(panDOBText)) {
      noiseFreeText[panDOBLine] = undefined;
    }
  }

  const panFathersNameHeadingLine =
    panHeadingLineNumbers["pan_fathers_name_text_line"];
  if (panFathersNameHeadingLine) {
    const panFathersNameLine = panFathersNameHeadingLine + 1;
    const panFathersNameText = noiseFreeText[panFathersNameLine];
    if (!PAN_REGEX["words_format"].exec(panFathersNameText)) {
      noiseFreeText[panFathersNameLine] = undefined;
    }

    const panNameLine = panFathersNameHeadingLine - 1;
    const panNameText = noiseFreeText[panNameLine];
    if (!PAN_REGEX["words_format"].exec(panNameText)) {
      noiseFreeText[panNameLine] = undefined;
    }
  }
  return _.filter(noiseFreeText, line => {
    return !_.isEmpty(line);
  });
};

const parseBasicPANText = (
  textLines: Array<string>,
  panHeadingLineNumbers: Record<string, any>
) => {
  const parsedResult: any = {
    document_type: Constants.DOCUMENT_TYPES.PAN_CARD
  };
  const panNumberHeadingLine = panHeadingLineNumbers["pan_number_text_line"];

  const panNumberLine = panNumberHeadingLine + PAN_BASIC_MAP["number"];
  const panNameLine = panNumberHeadingLine + PAN_BASIC_MAP["name"];
  const panDOBLine = panNumberHeadingLine + PAN_BASIC_MAP["dob"];
  const panFatherNameLine =
    panNumberHeadingLine + PAN_BASIC_MAP["fathers_name"];

  parsedResult.identification_number = processPANNumber(
    textLines[panNumberLine]
  );
  parsedResult.name = textLines[panNameLine];
  parsedResult.date_of_birth = processPANDateOfBirth(textLines[panDOBLine]);
  parsedResult.fathers_name = textLines[panFatherNameLine];
  return parsedResult;
};

const parseAdvancePANText = (
  textLines: Array<string>,
  panHeadingLineNumbers: Record<string, any>
) => {
  const parsedResult: any = {
    document_type: Constants.DOCUMENT_TYPES.PAN_CARD
  };

  const panNumberLine =
    panHeadingLineNumbers["pan_number_text_line"] &&
    panHeadingLineNumbers["pan_number_text_line"] + 1;
  const panDOBLine =
    panHeadingLineNumbers["pan_DOB_text_line"] &&
    panHeadingLineNumbers["pan_DOB_text_line"] + 1;
  const panFatherNameLine =
    panHeadingLineNumbers["pan_fathers_name_text_line"] &&
    panHeadingLineNumbers["pan_fathers_name_text_line"] + 1;
  const panNameLine =
    panHeadingLineNumbers["pan_fathers_name_text_line"] &&
    panHeadingLineNumbers["pan_fathers_name_text_line"] - 1;

  parsedResult.identification_number = processPANNumber(
    textLines[panNumberLine]
  );
  parsedResult.name = textLines[panNameLine];
  parsedResult.date_of_birth = processPANDateOfBirth(textLines[panDOBLine]);
  parsedResult.fathers_name = textLines[panFatherNameLine];
  return parsedResult;
};

const filterRelevantPANtext = (rawTextLines: Array<string>) => {
  const noiseFreeText = removeNoiseFromText(rawTextLines);
  const panHeadingLineNumbers = parsePANHeadingLineNumbers(noiseFreeText);
  const filteredText = removeMisplacedText(
    noiseFreeText,
    panHeadingLineNumbers
  );
  return filteredText;
};

const parsePANDetails = (
  textLines: Array<string>,
  panHeadingLineNumbers: Record<string, any>,
  panFormat: string
) => {
  if (panFormat == Constants.PAN_FORMATS.BASIC) {
    return parseBasicPANText(textLines, panHeadingLineNumbers);
  }
  return parseAdvancePANText(textLines, panHeadingLineNumbers);
};

const validatePANText = (panHeadingLineNumbers: Record<string, any>) => {
  const {
    pan_number_text_line: panNumberTextLine,
    pan_IT_text_line: panIncomeTextLine
  } = panHeadingLineNumbers;
  return _.isNumber(panNumberTextLine) || _.isNumber(panIncomeTextLine);
};
// ******************************************************* //
// Logic for internal functions ends here                  //
// ******************************************************* //

// ******************************************************* //
// Logic for API handlers starts here                      //
// ******************************************************* //
PANParser.parseDocumentDetails = (rawTextLines: Array<string>) => {
  const textLines = filterRelevantPANtext(rawTextLines);
  const panHeadingLineNumbers = parsePANHeadingLineNumbers(textLines);
  // Validate document
  const isDocumentValid = validatePANText(panHeadingLineNumbers);
  if (!isDocumentValid) {
    return Constants.INVALID_DOCUMENT_RESPONSE;
  }

  const panFormat = getPANFormat(panHeadingLineNumbers);
  const parsedDetails = parsePANDetails(
    textLines,
    panHeadingLineNumbers,
    panFormat
  );
  return {
    is_document_valid: true,
    document_details: parsedDetails
  };
};
// ******************************************************* //
// Logic for API handlers ends here                        //
// ******************************************************* //

export default PANParser;
