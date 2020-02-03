import Constants from "../constants";
import PANParser from "./pan-parser";
import AadhaarParser from "./aadhaar-parser";

const DocumentParser = {};

DocumentParser[Constants.DOCUMENT_TYPES.PAN_CARD] = {
  parseDocumentDetails: PANParser.parseDocumentDetails
};

DocumentParser[Constants.DOCUMENT_TYPES.AADHAAR_CARD] = {
  parseDocumentDetails: AadhaarParser.parseDocumentDetails
};

export default DocumentParser;
