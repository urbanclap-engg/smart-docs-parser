const Constants: any = {};

Constants.OCR_AGENTS = {
  GOOGLE_VISION: "google-vision"
};

Constants.DOCUMENT_TYPES = {
  PAN_CARD: "PAN_CARD",
  AADHAAR_CARD: "AADHAAR_CARD"
};

Constants.MAX_LINES = 30;

Constants.PAN_FORMATS = {
  BASIC: "basic",
  ADVANCED: "advanced"
};

Constants.GENDER = {
  male: "M",
  MALE: "M",
  Male: "M",
  female: "F",
  FEMALE: "F",
  Female: "F"
};

Constants.EMPTY_RESPONSE = {
  raw_text: [],
  is_document_valid: false,
  document_details: {}
};

Constants.INVALID_DOCUMENT_RESPONSE = {
  raw_text: [],
  is_document_valid: false,
  document_details: {}
};

Constants.DEFAULT_LANUGUAGES = ["en"];

export default Constants;
