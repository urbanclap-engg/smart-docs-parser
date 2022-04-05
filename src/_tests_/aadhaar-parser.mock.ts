const DOCUMENT_DETAILS_BASE = {
  "date_of_birth": undefined,
  "fathers_name": undefined,
  "gender": undefined,
  "identification_number": undefined,
  "name": undefined,
  "document_type": undefined,
  "address": undefined,
};

export default {
  RAW_TEXTS: {
    NON_ENGLISH: [
      "भारतीय विशिष्ट पहचान प्राधिकरण",
      "ARDNAAR",
      "GUIGUEL SUATAN SUDHORITY OF INDIA",
      "Address:",
      "முகவரி:",
      "3/1, M G R.",
      "3/1, எம்.ஜி. NAGAR. MANALURPET,",
      "ஆர் நகர், மணலூர்பேட்டை Manafurpet, Viluppuram,",
      "மணலூர்பேட்டை,",
      "விழுப்புரம்,",
      "தமிழ் நாடு - 4",
      "TamilNadu-605754",
    ],
    FIRST_OCCURING_PIN_CODE: [
      "UNIQUE IDENTIFICATION AUTHORITY OF INDIA",
      "Address: Pawar Vadi Panchak,",
      "Relavay Lain Jawal, Jail Road.",
      "Nashik Road, Nashik Road,",
      "Nashik, Maharashtra, 422101",
      "Bengaluru-580001",
      "आधार",
      "पता पवार वाडी पंचक, रेलवे लाईन",
      "जवळ, जेल रोड, नाशिक रोड, नाशिक",
      "रोड, नाशिक, महाराष्ट्र, 422101",
    ],
    GUARDIAN_NAME_ADDRESS_HEADER: [
      "Unique Identification Authority of India",
      "Address: S/O Subhash, B-260, SECTOR-3,",
      "PHASE-3, DWARKA, South West Delhi,",
      "Delhi, 110078",
    ],
    UNWANTED_PREFIX_SUFFIX: [
      "Unique Identification Authority of India",
      "Address: -B-260, SECTOR-3,",
      "PHASE-3, DWARKA, South West Delhi,",
      "Delhi, 110078",
    ],
    UNDEFINED_ADDRESS: [
      "Unique Identification Authority of India",
      "Address: B-260, SECTOR-3,",
      "PHASE-3, DWARKA, South West Delhi,",
      "Delhi, 110",
    ],
    ADDRESS_END_LINE: [
      "Unique Identification Authority of India",
      "Address: B-260, SECTOR-3,",
      "PHASE-3, DWARKA, South West Delhi,",
      "Delhi-110078. ",
    ],
    ADDRESS_START_LINE: [
      "Address: B-260, SECTOR-3,",
      "PHASE-3, DWARKA, South West Delhi,",
      "Delhi, 110078",
    ]
  },
  PARSED_DETAILS: {
    NON_ENGLISH: {
      ...DOCUMENT_DETAILS_BASE,
      "document_type": "AADHAAR_CARD",
      "address": "3/1, M G NAGAR. MANALURPET, Manafurpet, Viluppuram, TamilNadu-605754",
    },
    FIRST_OCCURING_PIN_CODE: {
      ...DOCUMENT_DETAILS_BASE,
      "document_type": "AADHAAR_CARD",
      "address": "Pawar Vadi Panchak Relavay Lain Jawal, Jail Road. Nashik Road, Nashik Road, Nashik, Maharashtra, 422101",
      "fathers_name": "Pawar Vadi Panchak"
    },
    GUARDIAN_NAME_ADDRESS_HEADER: {
      ...DOCUMENT_DETAILS_BASE,
      "document_type": "AADHAAR_CARD",
      "address": "S/O Subhash  B-260  SECTOR-3 PHASE-3, DWARKA, South West Delhi, Delhi, 110078",
      "fathers_name": "Subhash"
    },
    UNWANTED_PREFIX_SUFFIX: {
      ...DOCUMENT_DETAILS_BASE,
      "document_type": "AADHAAR_CARD",
      "address": "B-260  SECTOR-3 PHASE-3, DWARKA, South West Delhi, Delhi, 110078",
    },
    UNDEFINED_ADDRESS: {
      ...DOCUMENT_DETAILS_BASE,
      "document_type": "AADHAAR_CARD",
    },
    ADDRESS_END_LINE: {
      ...DOCUMENT_DETAILS_BASE,
      "document_type": "AADHAAR_CARD",
      "address": "B-260  SECTOR-3 PHASE-3, DWARKA, South West Delhi, Delhi-110078",
    },
    ADDRESS_START_LINE: {
      ...DOCUMENT_DETAILS_BASE,
      "document_type": "AADHAAR_CARD",
      "address": "B-260  SECTOR-3 PHASE-3, DWARKA, South West Delhi, Delhi, 110078",
    }
  }
};
