# smart-docs-parser

https://medium.com/urbanclap-engineering/document-details-parsing-using-ocr-170bf6ad8a97

## Installation
```
$ npm install smart-docs-parser
```

## Usage
```Javascript
// ES6 import statement
import SmartDocuments from 'smart-docs-parser';

// Sample Request
const extractedDocumentDetails = await SmartDocuments.extractDocumentDetailsFromImage({
    document_url: 'https://avatars2.githubusercontent.com/u/20634933?s=40&v=4',
    document_type: 'PAN_CARD',
    ocr_library: {
      ocr_type: ‘google-vision’,
      api_key: ‘API_KEY_FOR_VISION’
    }
});

// Sample Response
{ raw_text: 
   [ 'INCOME TAX DEPARTMENT',
     'GOVT. OF INDIA',
     'Permanent Account Number Card',
     'PANAM8144G',
     '/Name',
     'ID NAME',
     'frar TT /Father\'s Name',
     'FATHER NAME',
     'ae of Birth',
     '13/02/1994',
     'SIGN',
     'at / Signature',
     '' ],
  is_document_valid: true,
  document_details: 
   { document_type: 'PAN_CARD',
     identification_number: 'PANAM8144G',
     name: 'ID NAME',
     date_of_birth: '1994-02-13T00:00:00.000Z',
     fathers_name: 'FATHER NAME' 
   } 
}
```

## Interfaces
### Request
```Javascript
export interface ExtractDocumentDetailsFromImageRequest {
  document_url: string;
  document_type: "PAN_CARD"|"AADHAAR_CARD";
  ocr_library: {
    ocr_type: "google-vision";
    api_key: string;
  };
}
```
### Response
```Javascript
export interface ExtractDocumentDetailsFromImageResponse {
  raw_text: Array<string>;
  is_document_valid: boolean;
  document_details: DocumentDetails;
}
interface DocumentDetails {
  document_type?: "PAN_CARD"|"AADHAAR_CARD";
  identification_number?: string;
  name?: string;
  fathers_name?: string;
  date_of_birth?: string;
  gender?: string;
  address?: string;
}
```

## Supported Parameters
### Document Type
- PAN_CARD
- AADHAAR_CARD
### OCR Library
- Google-Vision

## Current limitations
### Address parsing
Library can parse state name and pin-code but the accuracy of the system for complete address text parsing is not upto the mark due to the noise introduced by multilingual text. 

## Contributions
Contributions are welcome. Please create a pull-request if you want to add more document parsers, OCR libraries, test-support or enhance the existing code.

## Extending smart-docs-parser
* [Parsing more documents](https://github.com/SourabhJaz/smart-docs-parser/blob/master/docs/document_parser.md)
* [Adding more OCR libraries](https://github.com/SourabhJaz/smart-docs-parser/blob/master/docs/ocr_library.md)

## License
[MIT](https://github.com/SourabhJaz/smart-docs-parser/blob/master/LICENSE)
