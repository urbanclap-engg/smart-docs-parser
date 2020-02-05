import _ from "lodash";
import GoogleVision from "./google-vision";
import Constants from "../constants";
import Config from "config";

const OCR: any = {};

OCR[Constants.OCR_AGENTS.GOOGLE_VISION] = {
  extractDocumentText: GoogleVision.extractDocumentText
};

// Custom OCRs
if (Config.has("smart-docs-parser.custom_ocrs")) {
  const customOCRs = Config.get("smart-docs-parser.custom_ocrs");
  _.map(customOCRs, ocrConfig => {
    const ocrModule = require(`${ocrConfig.library_path}`);

    OCR[ocrConfig.ocr_library] = {
      extractDocumentText: ocrModule.extractDocumentText
    };
  });
}

export default OCR;
