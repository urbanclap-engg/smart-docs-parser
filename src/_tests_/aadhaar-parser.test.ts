import AadhaarParser from "../document-parser/aadhaar-parser";
import AADHAAR_PARSER_MOCKS from "./aadhaar-parser.mock";

test('Address parser should remove all the non-english text segments', () => {
  const parsedDetails = AadhaarParser.parseDocumentDetails({
    raw_text: AADHAAR_PARSER_MOCKS.RAW_TEXTS.NON_ENGLISH
  });
  expect(parsedDetails).toMatchObject({
    is_document_valid: true,
    document_details: AADHAAR_PARSER_MOCKS.PARSED_DETAILS.NON_ENGLISH
  })
});
test('Address parser should mark address end at the first occurance of pin code', () => {
  const parsedDetails = AadhaarParser.parseDocumentDetails({
    raw_text: AADHAAR_PARSER_MOCKS.RAW_TEXTS.FIRST_OCCURING_PIN_CODE
  });
  expect(parsedDetails).toMatchObject({
    is_document_valid: true,
    document_details: AADHAAR_PARSER_MOCKS.PARSED_DETAILS.FIRST_OCCURING_PIN_CODE
  })
});
test('Address parser should keep the address header starting with S/O, C/O, D/O etc.', () => {
  const parsedDetails = AadhaarParser.parseDocumentDetails({
    raw_text: AADHAAR_PARSER_MOCKS.RAW_TEXTS.GUARDIAN_NAME_ADDRESS_HEADER
  });
  expect(parsedDetails).toMatchObject({
    is_document_valid: true,
    document_details: AADHAAR_PARSER_MOCKS.PARSED_DETAILS.GUARDIAN_NAME_ADDRESS_HEADER
  })
});
test('Address parser should remove the unwanted prefix or suffix noise from the address', () => {
  const parsedDetails = AadhaarParser.parseDocumentDetails({
    raw_text: AADHAAR_PARSER_MOCKS.RAW_TEXTS.UNWANTED_PREFIX_SUFFIX
  });
  expect(parsedDetails).toMatchObject({
    is_document_valid: true,
    document_details: AADHAAR_PARSER_MOCKS.PARSED_DETAILS.UNWANTED_PREFIX_SUFFIX
  })
});
test('Address parser should return undefined address if the end line or start line of address is not identified', () => {
  const parsedDetails = AadhaarParser.parseDocumentDetails({
    raw_text: AADHAAR_PARSER_MOCKS.RAW_TEXTS.UNDEFINED_ADDRESS
  });
  expect(parsedDetails).toMatchObject({
    is_document_valid: true,
    document_details: AADHAAR_PARSER_MOCKS.PARSED_DETAILS.UNDEFINED_ADDRESS
  })
});
test('Address parser should identify the end line of address by pin code, even if it is followed by some unwanted characters', () => {
  const parsedDetails = AadhaarParser.parseDocumentDetails({
    raw_text: AADHAAR_PARSER_MOCKS.RAW_TEXTS.ADDRESS_END_LINE
  });
  expect(parsedDetails).toMatchObject({
    is_document_valid: true,
    document_details: AADHAAR_PARSER_MOCKS.PARSED_DETAILS.ADDRESS_END_LINE
  })
});
test('Address parser should identify the start line of address, even if it is first line of the raw text', () => {
  const parsedDetails = AadhaarParser.parseDocumentDetails({
    raw_text: AADHAAR_PARSER_MOCKS.RAW_TEXTS.ADDRESS_START_LINE
  });
  expect(parsedDetails).toMatchObject({
    is_document_valid: true,
    document_details: AADHAAR_PARSER_MOCKS.PARSED_DETAILS.ADDRESS_START_LINE
  })
});
