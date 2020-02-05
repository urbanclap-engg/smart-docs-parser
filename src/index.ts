import _ from "lodash";
import OCR from "./ocr";
import DocumentParser from "./document-parser";
import {
  ExtractDocumentDetailsFromImageRequest,
  ExtractDocumentDetailsFromImageResponse
} from "./interfaces/SmartDocuments";
import Constants from "./constants";
import Config from "config";

const SmartDocuments: any = {};

// ******************************************************* //
// Logic for internal functions starts here                //
// ******************************************************* //
const getAPIKeyFromConfig = (ocrLibrary: string): string => {
  if (Config.has("smart-docs-parser.api_keys")) {
    const apiKeys = Config.get("smart-docs-parser.api_keys");
    return _.get(apiKeys, `${ocrLibrary}`, "");
  }
  return "";
};

const extractRawText = async (
  documentURL: string,
  ocrLibrary: string,
  customOCRPath: string
) => {
  const apiKey = getAPIKeyFromConfig(ocrLibrary);
  if (!_.isEmpty(customOCRPath)) {
    const ocrModule = require(`${customOCRPath}`);
    return await ocrModule.extractDocumentText({
      document_url: documentURL,
      api_key: apiKey
    });
  }
  return await OCR[ocrLibrary].extractDocumentText({
    document_url: documentURL,
    api_key: apiKey
  });
};

const validateDocumentText = (rawText: Array<string>): boolean => {
  const numberOfLines = _.size(rawText);
  if (!numberOfLines || numberOfLines > Constants.MAX_LINES) {
    return false;
  }
  return true;
};

const parseDocumentDetails = async (
  documentType: string,
  rawText: Array<string>,
  customParserPath: string
) => {
  if (!_.isEmpty(customParserPath)) {
    const parserModule = require(`${customParserPath}`);
    return await parserModule.parseDocumentDetails({
      raw_text: rawText
    });
  }
  return await DocumentParser[documentType].parseDocumentDetails({
    raw_text: rawText
  });
};

// ******************************************************* //
// Logic for internal functions ends here                  //
// ******************************************************* //

// ******************************************************* //
// Logic for API handlers starts here                      //
// ******************************************************* //
SmartDocuments.extractDocumentDetailsFromImage = async (
  params: ExtractDocumentDetailsFromImageRequest
): Promise<ExtractDocumentDetailsFromImageResponse> => {
  const {
    document_type: documentType,
    document_url: documentURL,
    ocr_library: ocrLibrary,
    custom_parser_path: customParserPath,
    custom_ocr_path: customOCRPath
  } = params;

  const ocrResponse = await extractRawText(
    documentURL,
    ocrLibrary,
    customOCRPath
  );
  const rawText = _.get(ocrResponse, "raw_text", []);
  const isValidText = validateDocumentText(rawText);
  if (!isValidText) {
    return Constants.EMPTY_RESPONSE;
  }

  const documentDetails = await parseDocumentDetails(
    documentType,
    rawText,
    customParserPath
  );

  return {
    raw_text: rawText,
    is_document_valid: _.get(documentDetails, "is_document_valid"),
    document_details: _.get(documentDetails, "document_details")
  };
};
// ******************************************************* //
// Logic for API handlers ends here                        //
// ******************************************************* //

export default SmartDocuments;
