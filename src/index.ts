import _ from "lodash";
import OCR from "./ocr";
import DocumentParser from "./document-parser";
import {
  ExtractDocumentDetailsFromImageRequest,
  ExtractDocumentDetailsFromImageResponse
} from "./interfaces/SmartDocuments";
import Constants from "./constants";

const SmartDocuments: any = {};

// ******************************************************* //
// Logic for internal functions starts here                //
// ******************************************************* //
const validateOCRAgent = (selectedOCR: string, apiKey: string): boolean => {
  if (_.isEmpty(apiKey)) {
    return false;
  }
  const supportedOCR = _.values(Constants.OCR_AGENTS);
  if (!_.includes(supportedOCR, selectedOCR)) {
    return false;
  }
  return true;
};

const validateDocumentText = (rawText: Array<string>): boolean => {
  const numberOfLines = _.size(rawText);
  if (!numberOfLines || numberOfLines > Constants.MAX_LINES) {
    return false;
  }
  return true;
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
    ocr_library: ocrLibrary
  } = params;
  const { ocr_type: selectedOCR, api_key: apiKey } = ocrLibrary;
  const isValidOCR = validateOCRAgent(selectedOCR, apiKey);
  if (!isValidOCR) {
    return Constants.EMPTY_RESPONSE;
  }

  const ocrResponse = await OCR[selectedOCR].extractDocumentText(
    documentURL,
    apiKey
  );
  const rawText = _.get(ocrResponse, "raw_text", []);
  const isValidText = validateDocumentText(rawText);
  if (!isValidText) {
    return Constants.EMPTY_RESPONSE;
  }

  const documentDetails = await DocumentParser[
    documentType
  ].parseDocumentDetails({
    raw_text: rawText});
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
