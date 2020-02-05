import _ from "lodash";
import Constants from "../constants";
import PANParser from "./pan-parser";
import AadhaarParser from "./aadhaar-parser";
import Config from "config";

const DocumentParser = {};

DocumentParser[Constants.DOCUMENT_TYPES.PAN_CARD] = {
  parseDocumentDetails: PANParser.parseDocumentDetails
};

DocumentParser[Constants.DOCUMENT_TYPES.AADHAAR_CARD] = {
  parseDocumentDetails: AadhaarParser.parseDocumentDetails
};

// Custom Parsers
if (Config.has("smart-docs-parser.custom_parsers")) {
  const customParsers = Config.get("smart-docs-parser.custom_parsers");
  _.map(customParsers, parserConfig => {
    const parserModule = require(`${parserConfig.parser_path}`);

    DocumentParser[parserConfig.document_type] = {
      parseDocumentDetails: parserModule.parseDocumentDetails
    };
  });
}

export default DocumentParser;
