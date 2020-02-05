> **NOTE** This guide is intended for engineers extending `smart-docs-parser` for their custom use-case. If you think this could be benificial to the community then please contribute to `smart-docs-parser` source-code using the generic guide [here](https://github.com/SourabhJaz/smart-docs-parser/blob/master/docs/document_parser.md).

# Configuration changes
### config/default.json
Add config variable for _custom_parsers_ in the format
```Javascript
    "custom_parsers": [{
      "document_type": "YOUR_DOCUMENT_TYPE",
      "parser_path": "/Users/sourabhjajoria/Desktop/your_parser.js"
    }]
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

module.exports = { parseDocumentDetails };
```
### Request
Your parser should accept `{ raw_text: Array<string>}` as input.

### Response
Your parser should return `{ is_document_valid: boolean, document_details: object }` as output.

# Example
Please refer to [sample_parser.js](https://github.com/SourabhJaz/smart-docs-parser/blob/master/docs/sample_parser.js)
