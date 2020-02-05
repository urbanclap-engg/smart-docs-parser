# smart-docs-parser

```smart-docs-parser``` is a NodeJs library to parse details from ID images.

https://medium.com/urbanclap-engineering/document-details-parsing-using-ocr-170bf6ad8a97

## How does it work?

```smart-docs-parser``` works in three steps:
- Extraction of raw text from document image using OCR
- Validation of document image based on passed document type and extracted raw text
- Parsing relevant information from raw text using document parser

## Installation
```
$ npm install smart-docs-parser
```

## Usage
### Configuration
Create a _config_ folder at the root of your project. Add _default.json_ file to the _config_ folder.
#### config/default.json
```Javascript
{
  "smart-docs-parser": {
    "api_keys": {
      "google-vision": "YOUR_API_KEY"
    }
  }
}
```
### Code
```
// ES6 import statement
import SmartDocuments from 'smart-docs-parser';

// Sample Request
const extractedDocumentDetails = await SmartDocuments.extractDocumentDetailsFromImage({
    document_url: 'https://avatars2.githubusercontent.com/u/20634933?s=40&v=4',
    document_type: 'PAN_CARD',
    ocr_library: 'google-vision
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
  document_type: string;
  ocr_library: string
}
```
### Response
```Javascript
export interface ExtractDocumentDetailsFromImageResponse {
  raw_text: Array<string>;
  is_document_valid: boolean;
  document_details: DocumentDetails | object;
}
interface DocumentDetails {
  document_type?: string;
  identification_number?: string;
  name?: string;
  fathers_name?: string;
  date_of_birth?: string;
  gender?: string;
  address?: string;
}
```
**raw_text** is the text extracted by the OCR

**is_document_valid** denotes whether the document is valid based on input *document_type* and extracted *raw_text*

**document_details** is the document information parsed using the specific document parser

## Supported Request Parameters
### Document Type
* PAN CARD
``` Javascript
    document_type: 'PAN_CARD'
```
* AADHAAR CARD
``` Javascript
    document_type: 'AADHAAR_CARD'
```
### OCR Library
* Google Vision
``` Javascript
    ocr_library: 'google-vision'
```

## Current limitations
### Address parsing
Library can parse state name and pin-code but the accuracy of the system for complete address text parsing is not upto the mark due to the noise introduced by multilingual text. 

## Contributions
Contributions are welcome. Please create a pull-request if you want to add more document parsers, OCR libraries, test-support or enhance the existing code.

## Extending smart-docs-parser
### For specific use-cases
* [Parsing more documents](https://github.com/SourabhJaz/smart-docs-parser/blob/master/docs/custom_parser.md)
* [Adding more OCR libraries](https://github.com/SourabhJaz/smart-docs-parser/blob/master/docs/custom_ocr.md)

### Contributing to the library
* [Parsing more documents](https://github.com/SourabhJaz/smart-docs-parser/blob/master/docs/document_parser.md)
* [Adding more OCR libraries](https://github.com/SourabhJaz/smart-docs-parser/blob/master/docs/ocr_library.md)

## License
[MIT](https://github.com/SourabhJaz/smart-docs-parser/blob/master/LICENSE)
