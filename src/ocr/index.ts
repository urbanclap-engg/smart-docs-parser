import _ from "lodash";
import GoogleVision from "./google-vision";
import Constants from "../constants";

const OCR: any = {};

OCR[Constants.OCR_AGENTS.GOOGLE_VISION] = {
  extractDocumentText: GoogleVision.extractDocumentText
};

export default OCR;
