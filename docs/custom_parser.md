> **NOTE** This guide is intended for engineers extending `smart-docs-parser` for their custom use-case. If you think this could be benificial to the community then please contribute to `smart-docs-parser` source-code using the generic guide [here](https://github.com/SourabhJaz/smart-docs-parser/blob/master/docs/document_parser.md).

`smart-docs-parser` supports custom parser module for any document type as API argument. The module is required to implement a function of name `parseDocumentDetails` which accepts list of string lines as input and returns the parsed object as output.

# Usage
## Code
```Javascript
// ES6 import statement
import SmartDocuments from 'smart-docs-parser';
import CustomParser from '/path/to/parser_file';

// Sample Request
const extractedDocumentDetails = await SmartDocuments.extractDocumentDetailsFromImage({
    document_url: 'https://avatars2.githubusercontent.com/u/20634933?s=40&v=4',
    document_type: 'your-document-type',
    ocr_library: 'google-vision',
    custom_parser: CustomParser
});
```


# Parser Implementation
## /path/to/parser_file.js
### Module
Your parser should expose a function called `parseDocumentDetails`
``` 
// ******************************************************* //
// Logic for API handlers starts here                      //
// ******************************************************* //
const parseDocumentDetails  = ({ raw_text: rawText }) => {
  ....
  ....
  ....
  return {
    is_document_valid: true,
    document_details: parsedDetails
  };
};
// ******************************************************* //
// Logic for API handlers ends here                        //
// ******************************************************* //

export default { parseDocumentDetails };
```
### Request
Your parser should accept `{ raw_text: Array<string>}` as input.

### Response
Your parser should return `{ is_document_valid: boolean, document_details: object }` as output.

# Example
Please refer to [sample_parser.js](https://github.com/SourabhJaz/smart-docs-parser/blob/master/docs/sample_parser.js)
