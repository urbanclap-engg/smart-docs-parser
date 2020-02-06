> **NOTE** This guide is intended for engineers extending `smart-docs-parser` for their custom use-case. If you think this could be benificial to the community then please contribute to `smart-docs-parser` source-code using the generic guide [here](https://github.com/SourabhJaz/smart-docs-parser/blob/master/docs/document_parser.md).

`smart-docs-parser` supports custom OCR module as API argument. The module is required to implement a function of name `extractDocumentText` which accepts document image url, API key as input and returns the list of string lines as output.

# Usage
## Configuration
### config/default.json
Add OCR API key (if any) to the configuration
```Javascript
  "smart-docs-parser": {
    "api_keys": {
      "your-library-name": "YourAPIKEY"
    }
  }
```
## Code
```Javascript
// ES6 import statement
import SmartDocuments from 'smart-docs-parser';
import CustomOCR from '/path/to/ocr_file';

// Sample Request
const extractedDocumentDetails = await SmartDocuments.extractDocumentDetailsFromImage({
    document_url: 'https://avatars2.githubusercontent.com/u/20634933?s=40&v=4',
    document_type: 'PAN_CARD',
    ocr_library: 'your-library-name',
    custom_ocr: CustomOCR
});
```
# OCR Implementation
## /path/to/ocr_file.ts
### Module
Your OCR should expose a function called `extractDocumentText`
``` 
// ******************************************************* //
// Logic for API handlers starts here                      //
// ******************************************************* //
const extractDocumentText = ({ document_url: documentURL, api_key: apiKey }) => {
  ....
  ....
  return {
    	raw_text: rawText
    }
};
// ******************************************************* //
// Logic for API handlers ends here                        //
// ******************************************************* //

export default { extractDocumentText };
```
### Request
Your parser function should accept `{ document_url: string, api_key: string }` as input.

### Response
Your parser function should return `{ raw_text: Array<string> }` as output.

# Example
Please refer to [sample_ocr.ts](https://github.com/urbanclap-engg/smart-docs-parser/blob/master/docs/sample_ocr.ts)
